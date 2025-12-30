import { format, isAfter, parseISO } from 'date-fns';

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | null): string => {
    if (!date) return 'No date';
    return format(date, 'MMM dd, yyyy');
};

/**
 * Format a date with time
 */
export const formatDateTime = (date: Date): string => {
    return format(date, 'MMM dd, yyyy h:mm a');
};

/**
 * Check if an assignment is overdue
 */
export const isOverdue = (dueDate: Date | null, status: string): boolean => {
    if (!dueDate || status !== 'Pending') return false;
    const now = new Date();
    return isAfter(now, dueDate);
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Convert Firestore Timestamp to Date
 */
export const timestampToDate = (timestamp: any): Date => {
    if (timestamp?.toDate) {
        return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
        return timestamp;
    }
    if (typeof timestamp === 'string') {
        return parseISO(timestamp);
    }
    return new Date();
};
