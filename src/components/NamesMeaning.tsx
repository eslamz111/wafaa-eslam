import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const names = [
  {
    name: "وفاء",
    meaning: "اسم وفاء معناه الإخلاص والوفا بالوعد",
    description: "يعني اللي بتحب بجد وبتفضل واقفة جنب حبيبها مهما حصل. وده بالظبط إنتِ يا وفا… أوفى حد في حياتي ❤️",
    emoji: "🌸",
  },
  {
    name: "إسلام",
    meaning: "اسم إسلام معناه السلام والتسليم لله",
    description: "يعني الإنسان اللي قلبه مليان إيمان وسلام. وأنا كل سلامي وأماني في إنك تكوني جنبي على طول 🤲",
    emoji: "🕊️",
  },
];

const NamesMeaning = () => {
  return (
    <section className="py-20">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles className="inline w-8 h-8 gold-text ml-2" />
          معنى أسامينا
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-8">
          {names.map((item, index) => (
            <motion.div
              key={item.name}
              className="romantic-card text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-5xl mb-4 block">{item.emoji}</span>
              <h3 className="font-display text-3xl text-primary mb-3">{item.name}</h3>
              <p className="gold-text font-body text-lg font-bold mb-3">{item.meaning}</p>
              <p className="text-foreground/70 font-body leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NamesMeaning;
