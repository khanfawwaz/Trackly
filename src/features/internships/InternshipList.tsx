import React, { useState } from 'react';
import { useInternships } from './useInternships';
import { Internship, InternshipStatus } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import Button from '../../components/Button';
import TabNavigation from '../../components/TabNavigation';
import Modal from '../../components/Modal';

const InternshipList: React.FC = () => {
    const { internships, loading, createInternship, updateInternship, deleteInternship } = useInternships();
    const [activeTab, setActiveTab] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingInternship, setEditingInternship] = useState<Internship | undefined>();
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        platform: '',
        applicationDate: '',
        status: 'Applied' as InternshipStatus,
        interviewDate: '',
        notes: '',
    });

    const tabs = ['All', 'Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

    const filteredInternships = internships.filter((internship) => {
        if (activeTab === 'All') return true;
        return internship.status === activeTab;
    });

    const handleEdit = (internship: Internship) => {
        setEditingInternship(internship);
        setFormData({
            company: internship.company,
            role: internship.role,
            platform: internship.platform,
            applicationDate: internship.applicationDate.toISOString().split('T')[0],
            status: internship.status,
            interviewDate: internship.interviewDate ? internship.interviewDate.toISOString().split('T')[0] : '',
            notes: internship.notes,
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this internship application?')) {
            await deleteInternship(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            applicationDate: new Date(formData.applicationDate),
            interviewDate: formData.interviewDate ? new Date(formData.interviewDate) : null,
        };

        if (editingInternship) {
            await updateInternship(editingInternship.id, data);
        } else {
            await createInternship(data);
        }

        setIsFormOpen(false);
        setEditingInternship(undefined);
        setFormData({
            company: '',
            role: '',
            platform: '',
            applicationDate: '',
            status: 'Applied',
            interviewDate: '',
            notes: '',
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
                    <h1 className="text-3xl font-bold text-text">Internships</h1>
                    <p className="text-text-muted mt-1">Track your internship applications</p>
                </div>
                <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                    + New Application
                </Button>
            </div>

            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {filteredInternships.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No applications found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredInternships.map((internship) => (
                            <div key={internship.id} className="bg-background-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all duration-200 border border-neutral-700 hover:border-secondary/50">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text">{internship.company}</h3>
                                        <p className="text-sm text-text-muted">{internship.role}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3 text-sm text-text-muted">
                                    <p>📍 Platform: {internship.platform}</p>
                                    <p>📅 Applied: {formatDate(internship.applicationDate)}</p>
                                </div>
                                {internship.notes && (
                                    <p className="text-sm text-text mb-3 line-clamp-2">{internship.notes}</p>
                                )}
                                <div className="flex items-center gap-2 pt-3 border-t border-neutral-700">
                                    <select
                                        value={internship.status}
                                        onChange={(e) => updateInternship(internship.id, { status: e.target.value as InternshipStatus })}
                                        className={`
                                            px-4 py-2 text-sm font-medium rounded-2xl cursor-pointer transition-all
                                            border-2 outline-none focus:ring-2 focus:ring-offset-1
                                            ${internship.status === 'Applied' ? 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 focus:ring-neutral-300' : ''}
                                            ${internship.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-300' : ''}
                                            ${internship.status === 'Interview' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 focus:ring-yellow-300' : ''}
                                            ${internship.status === 'Offer' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-300' : ''}
                                            ${internship.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 focus:ring-red-300' : ''}
                                        `}
                                    >
                                        <option value="Applied">📝 Applied</option>
                                        <option value="Shortlisted">⭐ Shortlisted</option>
                                        <option value="Interview">💼 Interview</option>
                                        <option value="Offer">🎉 Offer</option>
                                        <option value="Rejected">❌ Rejected</option>
                                    </select>
                                    <div className="ml-auto flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(internship)}>Edit</Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(internship.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingInternship ? 'Edit Application' : 'New Application'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Company *</label>
                        <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Role *</label>
                        <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Platform *</label>
                        <input type="text" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" placeholder="LinkedIn, Indeed, etc." required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Application Date *</label>
                        <input type="date" value={formData.applicationDate} onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Status *</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as InternshipStatus })} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    {formData.status === 'Interview' && (
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Interview Date</label>
                            <input
                                type="date"
                                value={formData.interviewDate}
                                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                                className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">Notes</label>
                        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">{editingInternship ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InternshipList;
