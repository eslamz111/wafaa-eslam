import { motion } from "framer-motion";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface DreamItem {
  id: string;
  icon?: string;
  text?: string;
}

const fallbackDreams: any[] = [];

const Dreams = () => {
  const { data: firestoreItems } = useFirestoreCollection<DreamItem>("futurePlans");
  const dreams = firestoreItems;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          مستقبلنا 🌍
        </motion.h2>

        <motion.p
          className="text-center font-body text-lg text-foreground/70 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          أحلامنا اللي هنحققها سوا إن شاء الله ❤️
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {dreams.map((d, i) => (
            <motion.div
              key={d.id}
              className="romantic-card p-6 text-center"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <motion.span
                className="text-4xl block mb-3"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                {d.icon}
              </motion.span>
              <p className="font-body text-lg text-foreground/80">{d.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dreams;
