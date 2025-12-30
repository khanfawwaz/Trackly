import React, { useState } from 'react';
import { useAssignments } from './useAssignments';
import { Assignment } from '../../types';
import { isOverdue } from '../../utils/dateUtils';
import AssignmentCard from './AssignmentCard';
import AssignmentForm from './AssignmentForm';
import TabNavigation from '../../components/TabNavigation';
import Button from '../../components/Button';

const AssignmentList: React.FC = () => {
    const { assignments, loading, createAssignment, updateAssignment, deleteAssignment, toggleStatus } = useAssignments();
    const [activeTab, setActiveTab] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();

    const tabs = ['All', 'Pending', 'Completed'];

    // Filter assignments based on active tab
    const filteredAssignments = assignments.filter((assignment) => {
        if (activeTab === 'All') return true;
        return assignment.status === activeTab;
    });

    // Sort: overdue assignments first in Pending tab
    const sortedAssignments = [...filteredAssignments].sort((a, b) => {
        if (activeTab === 'Pending') {
            const aOverdue = isOverdue(a.dueDate, a.status);
            const bOverdue = isOverdue(b.dueDate, b.status);

            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
        }

        return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const handleEdit = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            await deleteAssignment(id);
        }
    };

    const handleFormSubmit = async (data: Omit<Assignment, 'id' | 'userId' | 'createdAt'>) => {
        if (editingAssignment) {
            await updateAssignment(editingAssignment.id, data);
        } else {
            await createAssignment(data);
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingAssignment(undefined);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-text">Assignments</h1>
                    <p className="text-text-muted mt-1">Track your assignments and deadlines</p>
                </div>
                <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                    + New Assignment
                </Button>
            </div>

            {/* Tabs */}
            <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Assignment Grid */}
            <div className="mt-6">
                {sortedAssignments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No assignments found</p>
                        <p className="text-text-dark text-sm mt-2">
                            {activeTab === 'All'
                                ? 'Create your first assignment to get started'
                                : `No ${activeTab.toLowerCase()} assignments`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedAssignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                onToggleStatus={toggleStatus}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <AssignmentForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialData={editingAssignment}
            />
        </div>
    );
};

export default AssignmentList;
