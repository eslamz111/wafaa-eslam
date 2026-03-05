import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface WhyItem {
  id: string;
  text?: string;
}

const fallbackReasons: any[] = [];

const WhyILoveYou = () => {
  const [current, setCurrent] = useState<string | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);

  const { data: firestoreItems } = useFirestoreCollection<WhyItem>("whyILoveYou");
  const reasons = firestoreItems.map((i) => i.text || "").filter(Boolean);

  const handleClick = () => {
    const r = reasons[Math.floor(Math.random() * reasons.length)];
    setCurrent(r);
    setHearts((prev) => [...prev, Date.now()]);
    setTimeout(() => setHearts((prev) => prev.slice(1)), 2000);
  };

  return (
    <section className="py-20 bg-secondary/20 relative overflow-hidden">
      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ليه بحبك؟ 💌
        </motion.h2>

        <div className="flex flex-col items-center gap-8">
          <motion.button
            onClick={handleClick}
            className="px-10 py-4 rounded-full romantic-gradient text-primary-foreground font-body text-xl shadow-lg relative"
            whileHover={{ scale: 1.06, boxShadow: "0 0 30px hsl(var(--primary) / 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            دوسي اعرفي ليه بحبك ❤️
          </motion.button>

          <div className="h-24 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {current && (
                <motion.p
                  key={current}
                  className="font-display text-2xl sm:text-3xl text-primary text-center"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {current}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Heart burst */}
            {hearts.map((id) => (
              <motion.div
                key={id}
                className="absolute pointer-events-none"
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 2, y: -60 }}
                transition={{ duration: 1.5 }}
              >
                <Heart className="w-8 h-8 text-primary" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyILoveYou;
