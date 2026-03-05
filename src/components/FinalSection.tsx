import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const FinalSection = () => {
    const { data: finalData } = useFirestoreDoc<{ title?: string; subtitle?: string }>("settings", "final");
    const title = finalData?.title || "بس كدا خلصت الحكاية اللي عمرها ما تخلص ❤️";
    const subtitle = finalData?.subtitle || "اضغط هنا ترجع لفوق وتبدأ الحكاية من أولها 💕";
    const [hearts, setHearts] = useState<number[]>([]);

    const handleClick = () => {
        // Trigger heart burst
        const newHearts = Array.from({ length: 16 }, () => Date.now() + Math.random() * 1000);
        setHearts(newHearts);

        // Smooth scroll to top
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 400);

        // Clear hearts after animation
        setTimeout(() => setHearts([]), 2500);
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Romantic gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

            <div className="section-container relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="cursor-pointer"
                    onClick={handleClick}
                >
                    <motion.h2
                        className="font-display text-3xl sm:text-4xl lg:text-5xl text-primary mb-6 leading-relaxed"
                        style={{
                            textShadow: "0 0 40px hsl(340 65% 55% / 0.3), 0 0 80px hsl(340 65% 55% / 0.1)",
                        }}
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        className="font-body text-lg text-foreground/60 mb-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full romantic-gradient text-primary-foreground"
                        whileHover={{ scale: 1.1, boxShadow: "0 0 40px hsl(340 65% 55% / 0.5)" }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                            boxShadow: [
                                "0 0 15px hsl(340 65% 55% / 0.2)",
                                "0 0 30px hsl(340 65% 55% / 0.4)",
                                "0 0 15px hsl(340 65% 55% / 0.2)",
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ArrowUp className="w-7 h-7" />
                    </motion.div>
                </motion.div>

                {/* Heart burst animation */}
                <AnimatePresence>
                    {hearts.map((id, i) => (
                        <motion.div
                            key={id}
                            className="absolute pointer-events-none"
                            style={{
                                left: "50%",
                                top: "50%",
                            }}
                            initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                            animate={{
                                opacity: 0,
                                scale: 1.5,
                                x: (Math.random() - 0.5) * 300,
                                y: (Math.random() - 0.5) * 300 - 100,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, delay: i * 0.03 }}
                        >
                            <Heart
                                className={`w-5 h-5 ${i % 2 === 0 ? "text-primary" : "text-pink-400"}`}
                                fill="currentColor"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default FinalSection;
