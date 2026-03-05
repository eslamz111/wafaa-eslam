import { motion, AnimatePresence } from "framer-motion";
import { Download, Heart } from "lucide-react";
import { useState } from "react";

interface InstallButtonProps {
    onInstall: () => Promise<boolean>;
    isInstallable: boolean;
}

const InstallButton = ({ onInstall, isInstallable }: InstallButtonProps) => {
    const [showHearts, setShowHearts] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    if (!isInstallable) return null;

    const handleClick = async () => {
        setIsInstalling(true);
        setShowHearts(true);

        const success = await onInstall();

        if (!success) {
            setIsInstalling(false);
        }

        // Keep hearts for a bit
        setTimeout(() => setShowHearts(false), 3000);
    };

    return (
        <div className="relative">
            {/* Floating hearts animation */}
            <AnimatePresence>
                {showHearts && (
                    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <motion.span
                                key={i}
                                className="absolute text-primary"
                                initial={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 0.5,
                                }}
                                animate={{
                                    opacity: 0,
                                    x: (Math.random() - 0.5) * 200,
                                    y: -(80 + Math.random() * 150),
                                    scale: 0.8 + Math.random() * 0.8,
                                    rotate: (Math.random() - 0.5) * 60,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.5 + Math.random() * 1,
                                    delay: Math.random() * 0.5,
                                    ease: "easeOut",
                                }}
                                style={{
                                    left: "50%",
                                    top: "50%",
                                    fontSize: `${14 + Math.random() * 12}px`,
                                }}
                            >
                                ❤️
                            </motion.span>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={handleClick}
                disabled={isInstalling}
                className="relative group flex items-center gap-3 px-6 py-3.5 rounded-2xl text-white font-body text-base font-bold shadow-xl overflow-hidden disabled:opacity-70"
                style={{
                    background: "linear-gradient(135deg, #ff4d6d, #ff758f, #ff4d6d)",
                    backgroundSize: "200% 200%",
                    boxShadow: "0 4px 25px rgba(255, 77, 109, 0.4), 0 0 40px rgba(255, 77, 109, 0.15)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Shimmer effect */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />

                <Download className="w-5 h-5 relative z-10" />
                <span className="relative z-10">حملي الموقع كتطبيق ❤️</span>
                <Heart className="w-4 h-4 relative z-10 heartbeat" fill="currentColor" />
            </motion.button>
        </div>
    );
};

export default InstallButton;
