import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 3,
  size: 12 + Math.random() * 16,
}));

const fallbackWords: string[] = [];

const SecretButton = () => {
  const [open, setOpen] = useState(false);
  const [visibleWords, setVisibleWords] = useState(0);

  const { data: secretData } = useFirestoreDoc<{ modalText?: string }>("settings", "secretMessage");

  const words = secretData?.modalText
    ? secretData.modalText.split(/(\s+|\n\n)/).filter(Boolean).map(w => w === "\n\n" ? "\n\n" : w.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (!open) {
      setVisibleWords(0);
      return;
    }
    const interval = setInterval(() => {
      setVisibleWords((p) => {
        if (p >= words.length) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [open, words.length]);

  return (
    <>
      <section className="py-12 text-center">
        <motion.button
          onClick={() => setOpen(true)}
          className="font-display text-xl px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg border-0 cursor-pointer"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08, boxShadow: "0 0 30px hsl(340 65% 55% / 0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          دوسي هنا متستعجليش 😂❤
        </motion.button>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-md"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 max-w-md w-full rounded-3xl p-8 romantic-card overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 250 }}
            >
              {/* Floating hearts inside modal */}
              {floatingHearts.map((h) => (
                <motion.div
                  key={h.id}
                  className="absolute text-primary/20 pointer-events-none"
                  style={{ left: `${h.x}%`, bottom: -20 }}
                  animate={{ y: [0, -300], opacity: [0.8, 0] }}
                  transition={{ duration: h.duration, delay: h.delay, repeat: Infinity }}
                >
                  <Heart style={{ width: h.size, height: h.size }} />
                </motion.div>
              ))}

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Heart className="w-12 h-12 text-primary mx-auto mb-6 heartbeat" />
                </motion.div>

                <p className="font-body text-lg text-foreground/90 leading-loose whitespace-pre-wrap" dir="rtl">
                  {words.slice(0, visibleWords).map((w, i) =>
                    w === "\n\n" ? <br key={i} /> : <span key={i}>{w} </span>
                  )}
                  {visibleWords < words.length && (
                    <span className="inline-block w-0.5 h-5 bg-primary/70 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SecretButton;
