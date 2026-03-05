import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart } from "lucide-react";

import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const floatingHearts = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 5 + Math.random() * 5,
  size: 10 + Math.random() * 12,
}));

const YouAreMyPeace = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  const { data: peaceData } = useFirestoreDoc<{ lines?: string[] }>("settings", "peace");
  const lines = peaceData?.lines || [];

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= lines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Soft glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      {/* Floating hearts */}
      {floatingHearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-primary/10 pointer-events-none"
          style={{ left: `${h.x}%`, bottom: -20 }}
          animate={{ y: [0, -600], opacity: [0.4, 0], rotate: [0, 20, -20, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
        >
          <Heart style={{ width: h.size, height: h.size }} fill="currentColor" />
        </motion.div>
      ))}

      <div className="section-container relative z-10" ref={ref}>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heart className="inline w-8 h-8 text-primary ml-2" fill="currentColor" />
          إنتي أماني
        </motion.h2>

        <div className="max-w-xl mx-auto text-center" dir="rtl">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className="font-body text-xl sm:text-2xl text-foreground/85 leading-loose mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={i < visibleLines ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {line}
              {i === visibleLines - 1 && visibleLines < lines.length && (
                <span className="inline-block w-0.5 h-5 bg-primary/70 mr-1 animate-pulse align-middle" />
              )}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouAreMyPeace;
