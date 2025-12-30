import React, { useState, useEffect } from 'react';
import { Assignment, Priority, AssignmentStatus } from '../../types';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

interface AssignmentFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Assignment, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
    initialData?: Assignment;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState<Priority>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<AssignmentStatus>('Pending');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setSubject(initialData.subject);
            setPriority(initialData.priority);
            setDueDate(initialData.dueDate ? initialData.dueDate.toISOString().split('T')[0] : '');
            setNotes(initialData.notes);
            setStatus(initialData.status);
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setTitle('');
        setSubject('');
        setPriority('Medium');
        setDueDate('');
        setNotes('');
        setStatus('Pending');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await onSubmit({
                title,
                subject,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                notes,
                status,
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error submitting assignment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Assignment' : 'New Assignment'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-text mb-1">
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-text mb-1">
                        Subject *
                    </label>
                    <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-text mb-1">
                        Priority *
                    </label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-text mb-1">
                        Due Date
                    </label>
                    <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-text mb-1">
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-muted"
                        placeholder="Add any additional notes..."
                    />
                </div>

                {initialData && (
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-text mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                            className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        {initialData ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AssignmentForm;
