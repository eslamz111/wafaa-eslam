import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const Footer = () => {
  const { data: namesData } = useFirestoreDoc<{ name1?: string; name2?: string }>("settings", "names");
  const name1 = namesData?.name1 || "";
  const name2 = namesData?.name2 || "";
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
            <Heart className="w-4 h-4 text-primary heartbeat" />
            <span>{name1} & {name2}</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
