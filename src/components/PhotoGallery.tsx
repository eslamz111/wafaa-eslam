import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

interface GalleryItem {
  id: string;
  imageUrl?: string;
  caption?: string;
  date?: string;
}

const fallbackPhotos: any[] = [];

const gradientColors = [
  "from-primary/20 to-accent/20",
  "from-accent/20 to-primary/20",
  "from-rose-deep/20 to-gold/20",
  "from-gold/20 to-primary/20",
  "from-primary/20 to-rose-deep/20",
  "from-accent/20 to-rose-deep/20",
];

const PhotoGallery = () => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const { data: firestoreItems } = useFirestoreCollection<GalleryItem>("gallery");
  const photos = firestoreItems;

  return (
    <section className="py-20 bg-secondary/30">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          📸 صورنا سوا
        </motion.h2>

        <p className="text-center text-muted-foreground font-body mb-10">
          كل صورة ليها حكاية ❤️
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => setSelected(photo)}
            >
              <div
                className={`aspect-square rounded-2xl bg-gradient-to-br ${gradientColors[index % gradientColors.length]
                  } border border-border shadow-md group-hover:shadow-xl transition-shadow flex items-center justify-center overflow-hidden`}
              >
                {photo.imageUrl ? (
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || "صورة"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl block mb-2">📷</span>
                    <p className="text-sm text-foreground/50 font-body">اضغط لإضافة صورة</p>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center px-1">
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{photo.caption}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{photo.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative flex flex-col items-center justify-center w-full h-full p-3 sm:p-6"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Full-size image */}
              {selected.imageUrl ? (
                <img
                  src={selected.imageUrl}
                  alt={selected.caption || "صورة"}
                  className="max-w-[95vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  onClick={() => setSelected(null)}
                />
              ) : (
                <span className="text-8xl">📷</span>
              )}

              {/* Caption overlay */}
              {(selected.caption || selected.date) && (
                <div className="mt-4 text-center px-4">
                  {selected.caption && (
                    <p className="text-lg sm:text-xl font-display text-white drop-shadow-lg">{selected.caption}</p>
                  )}
                  {selected.date && (
                    <p className="text-sm text-white/70 font-body mt-1">{selected.date}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoGallery;
