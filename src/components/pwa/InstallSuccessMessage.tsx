import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface SuccessMessageProps {
    show: boolean;
}

const InstallSuccessMessage = ({ show }: SuccessMessageProps) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                    {/* Floating hearts background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.span
                                key={i}
                                className="absolute text-primary"
                                initial={{
                                    opacity: 0,
                                    y: "100vh",
                                    x: `${Math.random() * 100}vw`,
                                    scale: 0.5 + Math.random() * 0.5,
                                }}
                                animate={{
                                    opacity: [0, 0.8, 0],
                                    y: "-20vh",
                                    rotate: (Math.random() - 0.5) * 40,
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    delay: Math.random() * 1.5,
                                    ease: "easeOut",
                                }}
                                style={{
                                    fontSize: `${16 + Math.random() * 20}px`,
                                }}
                            >
                                ❤️
                            </motion.span>
                        ))}
                    </div>

                    {/* Message card */}
                    <motion.div
                        className="relative z-10 text-center rounded-3xl p-8 border border-border/50 max-w-sm w-full"
                        style={{
                            background: "linear-gradient(135deg, hsl(350 30% 97%), hsl(340 60% 95%))",
                            boxShadow: "0 8px 50px rgba(255, 77, 109, 0.25)",
                        }}
                        initial={{ scale: 0.5, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <Heart
                                className="w-16 h-16 mx-auto mb-4 text-primary heartbeat"
                                fill="currentColor"
                            />
                        </motion.div>

                        <motion.p
                            className="font-body text-xl text-foreground leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            بقي عندك دلوقتي تطبيق ذكرياتنا ❤️
                        </motion.p>

                        <motion.div
                            className="mt-4 flex justify-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {["💕", "🥰", "💖"].map((emoji, i) => (
                                <motion.span
                                    key={i}
                                    className="text-2xl"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                >
                                    {emoji}
                                </motion.span>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallSuccessMessage;
