import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface PromiseItem {
  id: string;
  text?: string;
}

const fallbackPromises: any[] = [];

const Promises = () => {
  const { data: firestoreItems } = useFirestoreCollection<PromiseItem>("promises");
  const promises = firestoreItems;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Floating hearts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10 text-2xl pointer-events-none"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          ❤️
        </motion.div>
      ))}

      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          وعد بينا 💍
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {promises.map((p, i) => (
            <motion.div
              key={p.id}
              className="romantic-card p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 25px hsl(var(--primary) / 0.2)" }}
            >
              <Heart className="w-6 h-6 text-primary mx-auto mb-3" />
              <p className="font-body text-lg text-foreground/80 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promises;
