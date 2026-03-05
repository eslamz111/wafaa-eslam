import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, X } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtubeUtils";

interface VideoItem {
  id: string;
  youtubeUrl?: string;
  caption?: string;
}

const fallbackVideos: any[] = [];

const gradientColors = [
  "from-primary/20 to-accent/20",
  "from-accent/20 to-primary/20",
  "from-rose-deep/20 to-gold/20",
  "from-gold/20 to-primary/20",
];

const VideoGallery = () => {
  const [selected, setSelected] = useState<VideoItem | null>(null);
  const { data: firestoreItems } = useFirestoreCollection<VideoItem>("videos");
  const videos = firestoreItems;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Floating hearts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/8 pointer-events-none"
          style={{ left: `${10 + i * 20}%`, top: `${5 + (i % 3) * 30}%` }}
          animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8" fill="currentColor" />
        </motion.div>
      ))}

      <div className="section-container relative z-10">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          🎥 فيديوهاتنا سوا
        </motion.h2>

        <p className="text-center text-muted-foreground font-body mb-10">
          كل فيديو فيه ذكرى حلوة ❤️
        </p>

        <div className="grid grid-cols-2 gap-5">
          {videos.map((video, index) => {
            const videoId = video.youtubeUrl ? extractYouTubeId(video.youtubeUrl) : null;
            return (
              <motion.div
                key={video.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelected(video)}
              >
                <div
                  className={`aspect-video rounded-2xl bg-gradient-to-br ${gradientColors[index % gradientColors.length]
                    } border border-border shadow-md group-hover:shadow-xl transition-shadow flex items-center justify-center relative overflow-hidden`}
                >
                  {videoId ? (
                    <img
                      src={getYouTubeThumbnail(videoId)}
                      alt={video.caption || "فيديو"}
                      className="w-full h-full object-cover absolute inset-0"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 transition-colors relative z-10">
                    <Play className="w-7 h-7 text-primary ml-0.5" fill="currentColor" />
                  </div>
                </div>
                <p className="mt-2 text-center font-body text-sm text-foreground/80">{video.caption}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/50 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="relative z-10 romantic-card max-w-lg w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              {(() => {
                const videoId = selected.youtubeUrl
                  ? extractYouTubeId(selected.youtubeUrl)
                  : null;
                if (videoId) {
                  return (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <iframe
                        src={`${getYouTubeEmbedUrl(videoId)}&autoplay=1`}
                        title={selected.caption || "فيديو"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0 pointer-events-auto"
                      />
                    </div>
                  );
                }
                return (
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <Play className="w-16 h-16 text-primary/40" />
                  </div>
                );
              })()}
              <p className="text-xl font-display text-primary">{selected.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoGallery;
