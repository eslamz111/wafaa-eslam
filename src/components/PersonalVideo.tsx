import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtubeUtils";

interface PersonalVideoData {
  youtubeUrl?: string;
  caption?: string;
}

const PersonalVideo = () => {
  const [open, setOpen] = useState(false);
  const { data: videoData } = useFirestoreDoc<PersonalVideoData>("settings", "personalVideo");

  const youtubeUrl = videoData?.youtubeUrl || "";
  const caption = videoData?.caption || "";
  const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  return (
    <section className="py-20 bg-secondary/20">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          رسالة ليكي يا وفا ❤️
        </motion.h2>

        <motion.div
          className="max-w-md mx-auto romantic-card p-8 text-center cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--primary) / 0.25)" }}
          onClick={() => setOpen(true)}
        >
          <div className="w-20 h-20 rounded-full romantic-gradient flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
          <p className="font-display text-xl text-primary mb-2">شغّلي الفيديو 🎬</p>
          <p className="font-body text-sm text-muted-foreground">{caption}</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative z-10 bg-card rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-border"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                {videoId ? (
                  <iframe
                    src={`${getYouTubeEmbedUrl(videoId)}&autoplay=1&fs=0`}
                    title="رسالة شخصية"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 pointer-events-auto"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <p className="font-body text-muted-foreground text-center px-4">
                      ضيف رابط الفيديو من الأدمن 🎥
                    </p>
                  </div>
                )}
              </div>

              <p className="font-body text-center text-foreground/70 text-sm">{caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PersonalVideo;
