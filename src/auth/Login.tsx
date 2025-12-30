import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { isValidEmail, isValidPassword } from '../utils/validation';
import Button from '../components/Button';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!isValidPassword(password)) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="flex justify-center -mb-2">
                        <img src="/assets/trackly%20logo.png" alt="Trackly Logo" className="h-32 w-auto object-contain" />
                    </div>
                    <h1 className="text-5xl font-bold text-gradient glow-text mb-1 relative z-10">Trackly</h1>
                    <p className="text-text-muted">Track your academic journey</p>
                </div>

                {/* Login Card */}
                <div className="bg-background-card rounded-lg shadow-card-hover border border-neutral-700 p-8">
                    <h2 className="text-2xl font-semibold text-text mb-6">Welcome back</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-md">
                            <p className="text-sm text-error">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text-muted"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-neutral-700 text-text rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text-muted"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full mt-6"
                            isLoading={isLoading}
                        >
                            Login
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-muted">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-secondary hover:text-secondary-400 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
