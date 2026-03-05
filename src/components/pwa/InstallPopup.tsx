import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Heart } from "lucide-react";

interface InstallPopupProps {
    show: boolean;
    onInstall: () => Promise<boolean>;
    onDismiss: () => void;
}

const InstallPopup = ({ show, onInstall, onDismiss }: InstallPopupProps) => {
    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onDismiss}
                    />

                    {/* Popup */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div
                            className="relative max-w-md mx-auto rounded-3xl border border-border/50 p-6 text-center overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, hsl(350 30% 97%), hsl(340 60% 95%))",
                                boxShadow: "0 -8px 40px rgba(255, 77, 109, 0.2), 0 0 60px rgba(255, 77, 109, 0.08)",
                            }}
                        >
                            {/* Decorative hearts */}
                            <div className="absolute top-3 right-4 text-2xl opacity-20 heartbeat">❤️</div>
                            <div className="absolute top-6 left-5 text-lg opacity-15" style={{ animationDelay: "0.3s" }}>💕</div>

                            {/* Close button */}
                            <button
                                onClick={onDismiss}
                                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Icon */}
                            <motion.div
                                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, #ff4d6d, #ff758f)",
                                    boxShadow: "0 4px 20px rgba(255, 77, 109, 0.3)",
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <Heart className="w-8 h-8 text-white" fill="white" />
                            </motion.div>

                            {/* Text */}
                            <motion.p
                                className="font-body text-lg text-foreground mb-1 leading-relaxed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                تحبي تحملي الموقع كتطبيق؟ ❤️
                            </motion.p>
                            <motion.p
                                className="font-body text-sm text-muted-foreground mb-6 leading-relaxed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                هيبقى أسهل تشوفي ذكرياتنا في أي وقت
                            </motion.p>

                            {/* Buttons */}
                            <motion.div
                                className="flex gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <button
                                    onClick={async () => {
                                        await onInstall();
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-body font-bold text-base transition-transform hover:scale-[1.02] active:scale-95"
                                    style={{
                                        background: "linear-gradient(135deg, #ff4d6d, #ff758f)",
                                        boxShadow: "0 4px 15px rgba(255, 77, 109, 0.35)",
                                    }}
                                >
                                    <Download className="w-5 h-5" />
                                    حمله
                                </button>

                                <button
                                    onClick={onDismiss}
                                    className="flex-1 py-3.5 rounded-2xl font-body font-medium text-base text-muted-foreground bg-muted/60 hover:bg-muted transition-colors active:scale-95"
                                >
                                    مش دلوقتي
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InstallPopup;
