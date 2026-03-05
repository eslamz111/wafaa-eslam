import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface LoveNoteItem {
  id: string;
  front?: string;
  back?: string;
}

const fallbackNotes: any[] = [];

const FlipCard = ({ front, back, index }: { front: string; back: string; index: number }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="h-56 cursor-pointer [perspective:1000px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.04 }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-[600ms] ease-in-out [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-card to-rose-soft border border-border shadow-lg flex flex-col items-center justify-center gap-4 p-6">
          <Heart className="w-10 h-10 text-primary heartbeat" />
          <p className="font-display text-xl text-primary text-center">{front}</p>
          <span className="text-xs text-muted-foreground font-body">اضغطي 💕</span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl romantic-gradient text-primary-foreground shadow-lg flex flex-col items-center justify-center p-6">
          <p className="font-body text-lg text-center leading-relaxed">{back}</p>
        </div>
      </div>
    </motion.div>
  );
};

const LoveNotes = () => {
  const { data: firestoreItems } = useFirestoreCollection<LoveNoteItem>("loveNotes");
  const notes = firestoreItems;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Floating hearts background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10 pointer-events-none"
          style={{ left: `${15 + i * 15}%`, top: `${10 + (i % 3) * 30}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8" />
        </motion.div>
      ))}

      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          💌 رسائل حب
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <FlipCard
              key={note.id}
              front={note.front || ""}
              back={note.back || ""}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoveNotes;
