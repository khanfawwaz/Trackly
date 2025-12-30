import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { isValidEmail, isValidPassword } from '../utils/validation';
// import { isUserLimitReached } from '../firebase/userManagement'; // Disabled - see TODO in handleSubmit
import Button from '../components/Button';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // TODO: User limit check disabled temporarily due to Firestore permissions
            // The security rules don't allow reading the entire users collection
            // This will need to be implemented via Cloud Functions or Firebase Admin SDK

            // const limitReached = await isUserLimitReached();
            // if (limitReached) {
            //     setError('Beta capacity reached. Please try later.');
            //     setIsLoading(false);
            //     return;
            // }

            await signup(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Signup error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="flex justify-center -mb-2">
                        <img src="/assets/trackly%20logo.png" alt="Trackly Logo" className="h-32 w-auto object-contain" />
                    </div>
                    <h1 className="text-5xl font-bold text-gradient glow-text mb-1 relative z-10">Trackly</h1>
                    <p className="text-text-muted">Track your academic journey</p>
                </div>

                {/* Signup Card */}
                <div className="bg-background-card rounded-lg shadow-card-hover border border-neutral-700 p-8">
                    <h2 className="text-2xl font-semibold text-text mb-6">Create your account</h2>

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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            Sign up
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="text-secondary hover:text-secondary-400 font-medium transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
