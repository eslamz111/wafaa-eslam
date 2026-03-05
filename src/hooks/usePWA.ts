import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [showInstallPopup, setShowInstallPopup] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);

            // Show install popup after 3 seconds if not dismissed before
            const dismissed = localStorage.getItem('pwa-popup-dismissed');
            if (!dismissed) {
                setTimeout(() => {
                    setShowInstallPopup(true);
                }, 3000);
            }
        };

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            setShowInstallPopup(false);
            setShowSuccessMessage(true);

            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    // Online/offline detection
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const installApp = useCallback(async () => {
        if (!deferredPrompt) return false;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setIsInstallable(false);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Install error:', err);
            return false;
        }
    }, [deferredPrompt]);

    const dismissPopup = useCallback(() => {
        setShowInstallPopup(false);
        localStorage.setItem('pwa-popup-dismissed', 'true');
    }, []);

    return {
        isInstallable,
        isInstalled,
        isOffline,
        showInstallPopup,
        showSuccessMessage,
        installApp,
        dismissPopup,
        setShowSuccessMessage,
    };
};
