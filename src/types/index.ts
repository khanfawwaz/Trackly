// Assignment Types
export type Priority = 'Low' | 'Medium' | 'High';
export type AssignmentStatus = 'Pending' | 'Completed';

export interface Assignment {
    id: string;
    userId: string;
    title: string;
    subject: string;
    priority: Priority;
    dueDate: Date | null;
    notes: string;
    createdAt: Date;
    status: AssignmentStatus;
}

// Project Types
export type ProjectType = string; // Allow any custom type (e.g., Academic, Personal, Freelance, etc.)
export type ProjectStatus = 'In Progress' | 'Completed';

export interface Project {
    id: string;
    userId: string;
    name: string;
    description: string;
    type: ProjectType;
    startDate: Date;
    dueDate: Date | null;
    repoLink: string;
    notes: string;
    status: ProjectStatus;
}

// Internship Types
export type InternshipStatus =
    | 'Applied'
    | 'Shortlisted'
    | 'Interview'
    | 'Offer'
    | 'Rejected';

export interface Internship {
    id: string;
    userId: string;
    company: string;
    role: string;
    platform: string;
    applicationDate: Date;
    status: InternshipStatus;
    interviewDate: Date | null;
    notes: string;
}

// User Type
export interface User {
    id: string;
    email: string;
    createdAt: Date;
    lastActiveAt: Date;
}

// Dashboard Summary Type
export interface DashboardSummary {
    pendingAssignments: number;
    overdueAssignments: number;
    projectsInProgress: number;
    internshipsByStatus: {
        applied: number;
        shortlisted: number;
        interview: number;
        offer: number;
        rejected: number;
    };
}
