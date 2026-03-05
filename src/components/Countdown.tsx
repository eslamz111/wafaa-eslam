import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

function getTimeSince(startDate: Date) {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
  };
}

const FALLBACK_DATE = new Date();

const Countdown = () => {
  const { data: settingsData } = useFirestoreDoc<{ anniversaryDate?: string }>(
    "settings",
    "anniversaryDate"
  );

  const startDate = settingsData?.anniversaryDate
    ? new Date(settingsData.anniversaryDate)
    : FALLBACK_DATE;

  const [time, setTime] = useState(getTimeSince(startDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeSince(startDate)), 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  const units = [
    { label: "سنة", value: time.years },
    { label: "شهر", value: time.months },
    { label: "يوم", value: time.days },
    { label: "ساعة", value: time.hours },
    { label: "دقيقة", value: time.minutes },
    { label: "ثانية", value: time.seconds },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Floating hearts */}
      <FloatingHearts count={10} />

      <div className="section-container text-center relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          بقالنا سوا قد كده ❤️
        </motion.h2>

        <motion.p
          className="text-lg text-foreground/70 font-body mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          من يوم 5/3/2024 وإحنا حكاية مبتخلصش ❤️
        </motion.p>

        <motion.p
          className="text-sm text-muted-foreground font-body mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          من يوم 5/3/2024 وإحنا مع بعض 💕
        </motion.p>

        <motion.div
          className="flex justify-center gap-3 sm:gap-5 flex-wrap max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {units.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="countdown-card w-[4.5rem] sm:w-28 text-center relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Glowing border */}
              <div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-sm"
              />
              <div className="relative romantic-card p-3 sm:p-4 rounded-2xl">
                <motion.span
                  className="text-2xl sm:text-4xl font-display text-primary block relative countdown-number"
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                >
                  {unit.value}
                </motion.span>
                <span className="text-xs sm:text-sm text-muted-foreground font-body">
                  {unit.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Countdown;
