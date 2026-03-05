import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const Footer = () => {
  const { data: namesData } = useFirestoreDoc<{ name1?: string; name2?: string }>("settings", "names");
  const name1 = namesData?.name1 || "";
  const name2 = namesData?.name2 || "";

  const [clickCount, setClickCount] = useState(0);
  const resetTimeoutRef = useRef<NodeJS.Timeout>();

  const handleHeartClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      window.location.href = "/admin/login";
      setClickCount(0);
    }

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1500);
  };

  return (
    <footer className="py-12 bg-secondary/30 border-t border-border">
      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-body">
            <span>صُنعت بكل</span>
            <Heart
              className="w-4 h-4 text-primary heartbeat cursor-pointer"
              onClick={handleHeartClick}
            />
            <span>{name1} & {name2}</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
