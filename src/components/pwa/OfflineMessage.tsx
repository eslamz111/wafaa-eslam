import { motion } from "framer-motion";
import { Heart, WifiOff } from "lucide-react";

const OfflineMessage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-6">
            <motion.div
                className="text-center max-w-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Animated heart */}
                <motion.div
                    className="relative mb-8"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Heart
                        className="w-24 h-24 mx-auto text-primary"
                        fill="currentColor"
                        style={{ filter: "drop-shadow(0 0 20px rgba(255, 77, 109, 0.4))" }}
                    />
                    <motion.div
                        className="absolute -top-2 -right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <WifiOff className="w-8 h-8 text-muted-foreground bg-background rounded-full p-1" />
                    </motion.div>
                </motion.div>

                {/* Floating mini hearts */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <motion.span
                            key={i}
                            className="absolute text-primary/20"
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                            }}
                            style={{
                                left: `${10 + Math.random() * 80}%`,
                                top: `${20 + Math.random() * 60}%`,
                                fontSize: `${12 + Math.random() * 12}px`,
                            }}
                        >
                            ❤
                        </motion.span>
                    ))}
                </div>

                {/* Text */}
                <motion.p
                    className="font-body text-xl text-foreground mb-3 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    يبدو إن مفيش إنترنت دلوقتي ❤️
                </motion.p>
                <motion.p
                    className="font-body text-lg text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    بس ذكرياتنا لسه موجودة هنا
                </motion.p>

                {/* Decorative dots */}
                <motion.div
                    className="mt-8 flex justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/40"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default OfflineMessage;
