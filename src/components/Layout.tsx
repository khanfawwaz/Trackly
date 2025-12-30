import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/assignments', label: 'Assignments', icon: '📝' },
        { path: '/projects', label: 'Projects', icon: '🚀' },
        { path: '/internships', label: 'Internships', icon: '💼' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-background-card border-b border-neutral-800 sticky top-0 z-30 backdrop-blur-sm bg-background-card/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex items-center -ml-2">
                                <img src="/assets/trackly%20logo.png" alt="Trackly" className="h-10 w-auto object-contain" />
                                <span className="text-2xl font-bold text-gradient glow-text ml-2">Trackly</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === item.path
                                            ? 'bg-primary text-white shadow-glow-primary'
                                            : 'text-text-muted hover:text-text hover:bg-primary/10'
                                        }
                  `}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:block text-sm text-text-muted">
                                {currentUser?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-text-muted hover:text-error transition-colors px-3 py-1.5 rounded-lg hover:bg-error/10"
                            >
                                Logout
                            </button>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-md text-text-muted hover:bg-primary/10 hover:text-primary"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-neutral-800 bg-background-card">
                        <nav className="px-4 py-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                    ${location.pathname === item.path
                                            ? 'bg-primary text-white shadow-glow-primary'
                                            : 'text-text-muted hover:text-text hover:bg-primary/10'
                                        }
                  `}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
