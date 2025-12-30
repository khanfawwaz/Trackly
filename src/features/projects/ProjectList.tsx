import React, { useState } from 'react';
import { useProjects } from './useProjects';
import { Project } from '../../types';
import { formatDate, isOverdue, isAlmostDue } from '../../utils/dateUtils';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import TabNavigation from '../../components/TabNavigation';
import Modal from '../../components/Modal';

const ProjectList: React.FC = () => {
    const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
    const [activeTab, setActiveTab] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Academic',
        startDate: '',
        dueDate: '',
        repoLink: '',
        notes: '',
        status: 'In Progress' as 'In Progress' | 'Completed',
    });

    const tabs = ['All', 'In Progress', 'Completed'];

    const filteredProjects = projects.filter((project) => {
        if (activeTab === 'All') return true;
        return project.status === activeTab;
    });

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            type: project.type,
            startDate: project.startDate.toISOString().split('T')[0],
            dueDate: project.dueDate ? project.dueDate.toISOString().split('T')[0] : '',
            repoLink: project.repoLink,
            notes: project.notes,
            status: project.status,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteProject(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            startDate: new Date(formData.startDate),
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        };

        if (editingProject) {
            await updateProject(editingProject.id, data);
        } else {
            await createProject(data);
        }

        setIsFormOpen(false);
        setEditingProject(undefined);
        setFormData({
            name: '',
            description: '',
            type: 'Academic',
            startDate: '',
            dueDate: '',
            repoLink: '',
            notes: '',
            status: 'In Progress',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text">Projects</h1>
                    <p className="text-text-muted mt-1">Manage your academic and personal projects</p>
                </div>
                <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                    + New Project
                </Button>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No projects found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project) => {
                            const overdue = isOverdue(project.dueDate, project.status);
                            const almostDue = !overdue && isAlmostDue(project.dueDate, project.status);

                            return (
                                <div key={project.id} className={`bg-background-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all duration-200 ${overdue ? 'border-2 border-error shadow-glow-primary' : almostDue ? 'border-2 border-yellow-500 shadow-glow-warning' : 'border border-neutral-700 hover:border-primary/50'}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-text">{project.name}</h3>
                                                {overdue && (
                                                    <Badge variant="danger" size="sm">
                                                        Overdue
                                                    </Badge>
                                                )}
                                                {almostDue && (
                                                    <Badge variant="warning" size="sm">
                                                        Almost Due
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant={project.type === 'Academic' ? 'primary' : 'info'}>
                                            {project.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-text-muted mb-3 line-clamp-2">{project.description}</p>
                                    <div className="space-y-1 mb-3 text-sm text-text-muted">
                                        <p>📅 Started: {formatDate(project.startDate)}</p>
                                        {project.dueDate && <p className={overdue ? 'text-error font-medium' : almostDue ? 'text-yellow-500 font-medium' : ''}>🎯 Due: {formatDate(project.dueDate)}</p>}
                                        {project.repoLink && (
                                            <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary-400 hover:underline block transition-colors">
                                                🔗 Repository
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                                        <select
                                            value={project.status}
                                            onChange={(e) => updateProject(project.id, { status: e.target.value as 'In Progress' | 'Completed' })}
                                            className={`
                                            px-4 py-2 text-sm font-medium rounded-2xl cursor-pointer transition-all
                                            border-2 outline-none focus:ring-2 focus:ring-offset-1
                                            ${project.status === 'Completed'
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-300'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 focus:ring-yellow-300'
                                                }
                                        `}
                                        >
                                            <option value="In Progress">⏳ In Progress</option>
                                            <option value="Completed">✓ Completed</option>
                                        </select>
                                        <div className="ml-auto flex gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(project)}>Edit</Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Name *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Description *</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Type *</label>
                        <input
                            type="text"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted"
                            placeholder="e.g., Academic, Personal, Freelance"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Start Date *</label>
                            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Due Date</label>
                            <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Repository Link</label>
                        <input type="url" value={formData.repoLink} onChange={(e) => setFormData({ ...formData, repoLink: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" placeholder="https://github.com/..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Notes</label>
                        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'In Progress' | 'Completed' })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">{editingProject ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectList;
