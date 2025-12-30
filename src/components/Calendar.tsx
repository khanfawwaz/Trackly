import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Assignment, Project, Internship } from '../types';

interface CalendarProps {
    assignments: Assignment[];
    projects: Project[];
    internships: Internship[];
}

const Calendar: React.FC<CalendarProps> = ({ assignments, projects, internships }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get current month and year
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Navigate months
    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Get events for a specific date
    const getEventsForDate = (day: number) => {
        const date = new Date(year, month, day);
        const dateStr = date.toDateString();

        const events: Array<{ type: string; title: string; color: string; link: string; id: string }> = [];

        // Check assignments
        assignments.forEach(assignment => {
            if (assignment.dueDate && assignment.dueDate.toDateString() === dateStr) {
                events.push({
                    type: 'Assignment',
                    title: assignment.title,
                    color: assignment.status === 'Completed' ? 'bg-success' : 'bg-primary',
                    link: '/assignments',
                    id: assignment.id
                });
            }
        });

        // Check projects
        projects.forEach(project => {
            if (project.dueDate && project.dueDate.toDateString() === dateStr) {
                events.push({
                    type: 'Project Due',
                    title: project.name,
                    color: project.status === 'Completed' ? 'bg-success' : 'bg-secondary',
                    link: '/projects',
                    id: project.id
                });
            }
            if (project.startDate.toDateString() === dateStr) {
                events.push({
                    type: 'Project Start',
                    title: project.name,
                    color: 'bg-warning',
                    link: '/projects',
                    id: project.id
                });
            }
        });

        // Check internships
        internships.forEach(internship => {
            if (internship.applicationDate.toDateString() === dateStr) {
                events.push({
                    type: 'Application',
                    title: internship.company,
                    color: 'bg-secondary',
                    link: '/internships',
                    id: internship.id
                });
            }
            if (internship.interviewDate && internship.interviewDate.toDateString() === dateStr) {
                events.push({
                    type: 'Interview',
                    title: internship.company,
                    color: 'bg-warning',
                    link: '/internships',
                    id: internship.id
                });
            }
        });

        return events;
    };

    // Check if date is today
    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    // Generate calendar days
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-24 bg-background-card/50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const events = getEventsForDate(day);
        const today = isToday(day);

        days.push(
            <div
                key={day}
                className={`h-24 bg-background-card border border-neutral-700 p-2 overflow-hidden hover:border-primary/50 transition-all ${today ? 'ring-2 ring-primary' : ''
                    }`}
            >
                <div className={`text-sm font-medium mb-1 ${today ? 'text-primary' : 'text-text'}`}>
                    {day}
                </div>
                <div className="space-y-1">
                    {events.slice(0, 2).map((event, idx) => (
                        <Link
                            key={idx}
                            to={event.link}
                            className={`block text-xs px-1.5 py-0.5 rounded ${event.color} text-white truncate hover:opacity-80 transition-opacity cursor-pointer`}
                            title={`${event.type}: ${event.title} (Click to view)`}
                        >
                            {event.title}
                        </Link>
                    ))}
                    {events.length > 2 && (
                        <div className="text-xs text-text-muted">+{events.length - 2} more</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-card rounded-lg p-6 shadow-card border border-neutral-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text">Calendar</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-text-muted hover:text-primary"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-lg font-medium text-text min-w-[200px] text-center">
                        {monthNames[month]} {year}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-text-muted hover:text-primary"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-text-muted py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-neutral-700 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary"></div>
                    <span className="text-text-muted">Assignments</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-secondary"></div>
                    <span className="text-text-muted">Projects/Applications</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-success"></div>
                    <span className="text-text-muted">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-warning"></div>
                    <span className="text-text-muted">Project Starts / Interviews</span>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
