import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface Props {
  dark: boolean;
  toggle: () => void;
}

const NightModeToggle = ({ dark, toggle }: Props) => {
  return (
    <motion.button
      onClick={toggle}
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg font-body text-sm text-foreground/80 hover:text-foreground transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      {dark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-primary" />}
      <span>{dark ? "وضع النهار ☀️" : "وضع الرومانسية 🌙"}</span>
    </motion.button>
  );
};

export default NightModeToggle;
