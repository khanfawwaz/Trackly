import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
    size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'md' }) => {
    const variants = {
        primary: 'bg-primary/20 text-primary border border-primary/30',
        success: 'bg-success/20 text-success border border-success/30',
        warning: 'bg-warning/20 text-warning border border-warning/30',
        danger: 'bg-error/20 text-error border border-error/30',
        neutral: 'bg-neutral-700/50 text-text-muted border border-neutral-600',
        info: 'bg-secondary/20 text-secondary border border-secondary/30',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

export default Badge;
