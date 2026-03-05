import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

interface StoryData {
  text?: string;
  milestones?: { date: string; icon: string; description: string }[];
}

const fallbackMilestones: any[] = [];

const OurStory = () => {
  const { data: storyData } = useFirestoreDoc<StoryData>("settings", "storyText");

  const storyText = storyData?.text || "";
  const milestones = storyData?.milestones || fallbackMilestones;

  return (
    <section id="our-story" className="py-20 bg-secondary/30">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          حكايتنا 💕
        </motion.h2>

        <motion.p
          className="text-center text-lg sm:text-xl text-foreground/80 font-body max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {storyText}
        </motion.p>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className="romantic-card flex items-start gap-4 sm:gap-6"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <span className="text-4xl shrink-0">{milestone.icon}</span>
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-primary mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 gold-text" />
                  {milestone.date}
                </h3>
                <p className="text-foreground/70 font-body text-lg leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStory;
