import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface TimelineItem {
  id: string;
  date?: string;
  title?: string;
  description?: string;
}

const fallbackMilestones: any[] = [];

const Timeline = () => {
  const { data: firestoreItems } = useFirestoreCollection<TimelineItem>("timeline");

  // Sort by date: oldest first
  const milestones = [...firestoreItems].sort((a, b) => {
    const parseDate = (d?: string) => {
      if (!d) return Infinity;
      // Try YYYY-MM-DD
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(d)) return new Date(d).getTime();
      // Try DD/MM/YYYY or DD-MM-YYYY
      const parts = d.split(/[\/\-\.]/);
      if (parts.length === 3 && parts[2].length === 4) {
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`).getTime();
      }
      const t = new Date(d).getTime();
      return isNaN(t) ? Infinity : t;
    };
    return parseDate(a.date) - parseDate(b.date);
  });

  return (
    <section className="py-20 bg-secondary/20 relative overflow-hidden">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          رحلتنا سوا 🗓️
        </motion.h2>

        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute right-6 sm:right-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20" />

          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              className={`relative flex items-start mb-12 last:mb-0 ${i % 2 === 0 ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
                }`}
              initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Dot */}
              <div className="absolute right-[18px] sm:right-1/2 sm:-translate-x-[-5px] z-10">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]" />
              </div>

              {/* Content */}
              <div className={`mr-12 sm:mr-0 ${i % 2 === 0 ? "sm:pr-12 sm:w-1/2" : "sm:pl-12 sm:w-1/2 sm:mr-auto sm:ml-[50%]"}`}>
                <div className="romantic-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground font-body">{m.date}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-primary mb-1">{m.title}</h3>
                  <p className="text-foreground/70 font-body text-sm leading-relaxed">{m.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
