import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setIsInstalled(true);
            } else {
                console.log('User dismissed the install prompt');
            }

            // Clear the deferredPrompt
            setDeferredPrompt(null);
        } else {
            // Fallback: Show instructions for manual installation
            alert(
                'To install Trackly on your Android device:\n\n' +
                '1. Open this website in Chrome browser\n' +
                '2. Tap the menu (⋮) in the top-right\n' +
                '3. Select "Add to Home screen"\n' +
                '4. Tap "Install" or "Add"\n\n' +
                'The app will appear on your home screen!'
            );
        }
    };

    // Don't show if already installed
    if (isInstalled) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
                <span>Download Trackly on Android</span>
            </button>
        </div>
    );
};

export default InstallPrompt;
