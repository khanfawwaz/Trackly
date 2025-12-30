import React from 'react';
import { Assignment } from '../../types';
import { formatDate, isOverdue, isAlmostDue } from '../../utils/dateUtils';
import Badge from '../../components/Badge';
import Button from '../../components/Button';

interface AssignmentCardProps {
    assignment: Assignment;
    onToggleStatus: (id: string, currentStatus: string) => void;
    onEdit: (assignment: Assignment) => void;
    onDelete: (id: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
    assignment,
    onToggleStatus,
    onEdit,
    onDelete,
}) => {
    const overdue = isOverdue(assignment.dueDate, assignment.status);
    const almostDue = !overdue && isAlmostDue(assignment.dueDate, assignment.status);

    const priorityColors = {
        Low: 'neutral',
        Medium: 'info',      // Cyan for medium
        High: 'primary',     // Purple for high
    } as const;

    return (
        <div
            className={`
        bg-background-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all duration-200
        ${overdue ? 'border-2 border-error shadow-glow-primary' : almostDue ? 'border-2 border-yellow-500 shadow-glow-warning' : 'border border-neutral-700 hover:border-primary/50'}
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-text">{assignment.title}</h3>
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
                    <p className="text-sm text-text-muted">{assignment.subject}</p>
                </div>
                <Badge variant={priorityColors[assignment.priority]}>
                    {assignment.priority}
                </Badge>
            </div>

            {/* Due Date */}
            {assignment.dueDate && (
                <div className="mb-3">
                    <p className={`text-sm ${overdue ? 'text-error font-medium' : almostDue ? 'text-yellow-500 font-medium' : 'text-text-muted'}`}>
                        📅 Due: {formatDate(assignment.dueDate)}
                    </p>
                </div>
            )}

            {/* Notes */}
            {assignment.notes && (
                <div className="mb-4">
                    <p className="text-sm text-text line-clamp-2">{assignment.notes}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-neutral-700">
                <Button
                    size="sm"
                    variant={assignment.status === 'Completed' ? 'secondary' : 'primary'}
                    onClick={() => onToggleStatus(assignment.id, assignment.status)}
                >
                    {assignment.status === 'Completed' ? '↩️ Reopen' : '✓ Complete'}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(assignment)}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(assignment.id)}
                    className="text-error hover:text-red-400 hover:bg-error/10"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default AssignmentCard;
