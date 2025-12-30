import React from 'react';
import { Link } from 'react-router-dom';
import { useAssignments } from '../features/assignments/useAssignments';
import { useProjects } from '../features/projects/useProjects';
import { useInternships } from '../features/internships/useInternships';
import { isOverdue } from '../utils/dateUtils';
import Calendar from '../components/Calendar';

const Dashboard: React.FC = () => {
    const { assignments, loading: assignmentsLoading } = useAssignments();
    const { projects, loading: projectsLoading } = useProjects();
    const { internships, loading: internshipsLoading } = useInternships();

    const loading = assignmentsLoading || projectsLoading || internshipsLoading;

    // Calculate metrics
    const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
    const overdueAssignments = assignments.filter(a => isOverdue(a.dueDate, a.status)).length;
    const projectsInProgress = projects.filter(p => p.status === 'In Progress').length;

    const internshipsByStatus = {
        applied: internships.filter(i => i.status === 'Applied').length,
        shortlisted: internships.filter(i => i.status === 'Shortlisted').length,
        interview: internships.filter(i => i.status === 'Interview').length,
        offer: internships.filter(i => i.status === 'Offer').length,
        rejected: internships.filter(i => i.status === 'Rejected').length,
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text">Dashboard</h1>
                <p className="text-text-muted mt-1">Overview of your academic journey</p>
            </div>

            {/* Calendar */}
            <div className="mb-8">
                <Calendar assignments={assignments} projects={projects} internships={internships} />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Pending Assignments */}
                <Link to="/assignments" className="group">
                    <div className="bg-background-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-neutral-700 hover:border-primary/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-text-muted text-sm font-medium">Pending Assignments</span>
                            <span className="text-2xl">📝</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{pendingAssignments}</p>
                    </div>
                </Link>

                {/* Overdue Assignments */}
                <Link to="/assignments" className="group">
                    <div className={`bg-background-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-200 ${overdueAssignments > 0 ? 'border-2 border-error shadow-glow-primary' : 'border border-neutral-700'} hover:border-error/70`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-text-muted text-sm font-medium">Overdue Assignments</span>
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className={`text-3xl font-bold ${overdueAssignments > 0 ? 'text-error' : 'text-text'}`}>
                            {overdueAssignments}
                        </p>
                    </div>
                </Link>

                {/* Projects in Progress */}
                <Link to="/projects" className="group">
                    <div className="bg-background-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-neutral-700 hover:border-primary/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-text-muted text-sm font-medium">Projects in Progress</span>
                            <span className="text-2xl">🚀</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{projectsInProgress}</p>
                    </div>
                </Link>

                {/* Total Internship Applications */}
                <Link to="/internships" className="group">
                    <div className="bg-background-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-neutral-700 hover:border-secondary/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-text-muted text-sm font-medium">Total Applications</span>
                            <span className="text-2xl">💼</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{internships.length}</p>
                    </div>
                </Link>
            </div>

            {/* Internship Applications Breakdown */}
            <div className="bg-background-card rounded-lg p-6 shadow-card border border-neutral-700">
                <h2 className="text-xl font-semibold text-text mb-4">Internship Applications by Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                        <p className="text-2xl font-bold text-text">{internshipsByStatus.applied}</p>
                        <p className="text-sm text-text-muted mt-1">Applied</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                        <p className="text-2xl font-bold text-secondary">{internshipsByStatus.shortlisted}</p>
                        <p className="text-sm text-secondary/80 mt-1">Shortlisted</p>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/30">
                        <p className="text-2xl font-bold text-warning">{internshipsByStatus.interview}</p>
                        <p className="text-sm text-warning/80 mt-1">Interview</p>
                    </div>
                    <div className="text-center p-4 bg-success/10 rounded-lg border border-success/30">
                        <p className="text-2xl font-bold text-success">{internshipsByStatus.offer}</p>
                        <p className="text-sm text-success/80 mt-1">Offer</p>
                    </div>
                    <div className="text-center p-4 bg-error/10 rounded-lg border border-error/30">
                        <p className="text-2xl font-bold text-error">{internshipsByStatus.rejected}</p>
                        <p className="text-sm text-error/80 mt-1">Rejected</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/assignments" className="bg-gradient-to-br from-primary to-primary-700 text-white rounded-lg p-6 shadow-card hover:shadow-glow-primary transition-all duration-200">
                    <h3 className="text-lg font-semibold mb-2">📝 Manage Assignments</h3>
                    <p className="text-primary-100 text-sm">Track deadlines and priorities</p>
                </Link>
                <Link to="/projects" className="bg-gradient-to-br from-secondary to-secondary-700 text-white rounded-lg p-6 shadow-card hover:shadow-glow-secondary transition-all duration-200">
                    <h3 className="text-lg font-semibold mb-2">🚀 Manage Projects</h3>
                    <p className="text-secondary-100 text-sm">Organize your work</p>
                </Link>
                <Link to="/internships" className="bg-gradient-to-br from-success to-green-700 text-white rounded-lg p-6 shadow-card hover:shadow-lg transition-all duration-200">
                    <h3 className="text-lg font-semibold mb-2">💼 Track Applications</h3>
                    <p className="text-green-100 text-sm">Monitor your progress</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
