import React from 'react';

interface TabNavigationProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex space-x-1 bg-background-card p-1 rounded-lg border border-neutral-700">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                        ${activeTab === tab
                            ? 'bg-primary text-white shadow-glow-primary'
                            : 'text-text-muted hover:text-text hover:bg-primary/10'
                        }
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;
