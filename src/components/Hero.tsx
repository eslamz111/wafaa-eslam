import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import InstallButton from "@/components/pwa/InstallButton";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { usePWA } from "@/hooks/usePWA";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  children?: ReactNode;
}

const Hero = ({ children }: HeroProps) => {
  const { data: namesData } = useFirestoreDoc<{
    name1?: string;
    name2?: string;
    subtitle?: string;
    tagline?: string;
  }>("settings", "names");

  const { isInstallable, installApp } = usePWA();

  const name1 = namesData?.name1 || "";
  const name2 = namesData?.name2 || "";
  const subtitle = namesData?.subtitle || "";
  const tagline = namesData?.tagline || "";

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      {/* Floating hearts */}
      <FloatingHearts count={8} />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Heart className="w-16 h-16 mx-auto mb-6 text-primary heartbeat" />
        </motion.div>

        <motion.h1
          className="font-display text-4xl sm:text-5xl lg:text-7xl text-primary mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {name1} & {name2}
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-foreground/80 font-body mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {subtitle}
        </motion.p>

        <motion.p
          className="text-lg gold-text font-body italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {tagline}
        </motion.p>

        {/* Music player slot */}
        {children}

        {/* PWA Install Button */}
        {isInstallable && (
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <InstallButton onInstall={installApp} isInstallable={isInstallable} />
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.a
          href="#our-story"
          className="mt-10 inline-flex flex-col items-center gap-2 text-primary/70 hover:text-primary transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <span
            className="font-body text-sm"
            style={{
              textShadow: "0 0 20px hsl(340 65% 55% / 0.3)",
            }}
          >
            انزلي لتحت علشان تشوفي الباقي❤️
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
