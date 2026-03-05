import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronUp, ChevronDown } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

interface PasswordLockProps {
  onUnlock: () => void;
}

const FALLBACK_CORRECT = [5, 3, 2024];

const NumberDial = ({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) => {
  const inc = () => onChange(value >= max ? min : value + 1);
  const dec = () => onChange(value <= min ? max : value - 1);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={inc}
        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <motion.div
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-14 h-16 rounded-xl bg-card border border-border shadow-md flex items-center justify-center"
        style={{ boxShadow: "0 0 15px hsl(340 65% 55% / 0.15)" }}
      >
        <span className="font-display text-2xl text-primary">{value}</span>
      </motion.div>
      <button
        onClick={dec}
        className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};

const PasswordLock = ({ onUnlock }: PasswordLockProps) => {
  const [vals, setVals] = useState([1, 1, 2024]);
  const [shaking, setShaking] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Try to get password from Firestore
  const { data: settingsData } = useFirestoreDoc<{
    lockDay?: number;
    lockMonth?: number;
    lockYear?: number;
    title?: string;
    buttonText?: string;
    tagline?: string;
    errorMessage?: string;
    successMessage?: string;
  }>("settings", "lockPassword");

  const correctPassword = settingsData
    ? [
      settingsData.lockDay ?? FALLBACK_CORRECT[0],
      settingsData.lockMonth ?? FALLBACK_CORRECT[1],
      settingsData.lockYear ?? FALLBACK_CORRECT[2],
    ]
    : FALLBACK_CORRECT;

  const setVal = useCallback(
    (idx: number, v: number) =>
      setVals((prev) => prev.map((p, i) => (i === idx ? v : p))),
    []
  );

  const handleUnlock = () => {
    if (
      vals[0] === correctPassword[0] &&
      vals[1] === correctPassword[1] &&
      vals[2] === correctPassword[2]
    ) {
      setUnlocking(true);
      setShowSuccess(true);
      // Show success message for 2.5s, then unlock
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(onUnlock, 400);
      }, 2500);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <AnimatePresence>
      {!unlocking ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-soft via-background to-gold-light"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Floating hearts */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/15 pointer-events-none"
              initial={{ y: "110vh", x: `${10 + i * 12}vw` }}
              animate={{ y: "-10vh" }}
              transition={{
                duration: 7 + i * 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.2,
              }}
            >
              <Heart className="w-6 h-6" fill="currentColor" />
            </motion.div>
          ))}

          <motion.div
            className="relative z-10 w-full max-w-xs mx-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Heart shape container */}
              <div className="relative flex flex-col items-center">
                {/* Text above heart lock */}
                <motion.p
                  className="font-display text-lg sm:text-xl text-primary/90 text-center mb-4 leading-relaxed"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{
                    textShadow:
                      "0 0 20px hsl(340 65% 55% / 0.2)",
                  }}
                >
                  {settingsData?.title || "لو فاكرة أول يوم قولتلك فيه بحبك ❤️"}
                </motion.p>

                {/* Heart SVG background */}
                <motion.div
                  className="relative w-64 h-64 flex items-center justify-center"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 15px hsl(340 65% 55% / 0.3))",
                      "drop-shadow(0 0 25px hsl(340 65% 55% / 0.5))",
                      "drop-shadow(0 0 15px hsl(340 65% 55% / 0.3))",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <svg
                    viewBox="0 0 256 256"
                    className="absolute inset-0 w-full h-full"
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="heartGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="hsl(340, 65%, 55%)" />
                        <stop offset="100%" stopColor="hsl(38, 75%, 55%)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M128 230 C 20 140, 0 80, 64 48 C 100 28, 128 60, 128 60 C 128 60, 156 28, 192 48 C 256 80, 236 140, 128 230Z"
                      fill="url(#heartGrad)"
                      opacity="0.15"
                      stroke="url(#heartGrad)"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Dials inside heart */}
                  <div className="relative z-10 flex items-center gap-2">
                    <NumberDial
                      value={vals[0]}
                      onChange={(v) => setVal(0, v)}
                      min={1}
                      max={31}
                    />
                    <span className="font-display text-2xl text-primary/60 mt-1">
                      /
                    </span>
                    <NumberDial
                      value={vals[1]}
                      onChange={(v) => setVal(1, v)}
                      min={1}
                      max={12}
                    />
                    <span className="font-display text-2xl text-primary/60 mt-1">
                      /
                    </span>
                    <NumberDial
                      value={vals[2]}
                      onChange={(v) => setVal(2, v)}
                      min={2020}
                      max={2030}
                    />
                  </div>
                </motion.div>

                {/* Unlock button */}
                <motion.button
                  onClick={handleUnlock}
                  className="mt-4 px-8 py-3 rounded-full romantic-gradient text-primary-foreground font-body text-lg shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px hsl(340 65% 55% / 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {settingsData?.buttonText || "افتح القفل 🔓"}
                </motion.button>

                {/* Tagline */}
                <p className="mt-6 font-display text-lg text-primary/80 text-center">
                  {settingsData?.tagline || "على عهدنا حتى نلتقي 💕"}
                </p>

                <AnimatePresence>
                  {shaking && (
                    <motion.p
                      className="mt-3 text-primary font-body text-sm text-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {settingsData?.errorMessage || "حاول تاني يا روحي ❤️"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-soft via-background to-gold-light"
          initial={{ opacity: 1 }}
          animate={{ opacity: showSuccess ? 1 : 0 }}
          transition={{ duration: showSuccess ? 0 : 0.6 }}
        >
          {/* Heart burst particles */}
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${i % 3 === 0
                ? "text-primary"
                : i % 3 === 1
                  ? "text-primary/70"
                  : "text-accent"
                }`}
              initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 1.2, delay: i * 0.05 }}
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </motion.div>
          ))}

          {/* Success message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                className="relative z-10 text-center px-6"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Heart
                    className="w-16 h-16 text-primary mx-auto mb-6"
                    fill="currentColor"
                  />
                </motion.div>
                <motion.p
                  className="font-display text-2xl sm:text-3xl text-primary leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    textShadow:
                      "0 0 30px hsl(340 65% 55% / 0.3)",
                  }}
                >
                  {settingsData?.successMessage || "شطورة يا قلبي انتي مخك دفتر كدا كدا ❤️"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordLock;
