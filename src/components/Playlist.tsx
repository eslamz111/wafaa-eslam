import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import MusicPlayer from "@/components/MusicPlayer";

interface SongItem {
  id: string;
  title?: string;
  artist?: string;
  audio_url?: string;
  audioUrl?: string;
}

const Playlist = () => {
  const { data: firestoreItems } = useFirestoreCollection<SongItem>("songs");
  const songs = firestoreItems;

  useEffect(() => {
    const handlePlay = (e: Event) => {
      const allAudios = document.querySelectorAll("audio");
      allAudios.forEach((audio) => {
        if (audio !== e.target) {
          audio.pause();
        }
      });
    };

    // We use setTimeout to ensure elements are rendered
    const timeout = setTimeout(() => {
      const audios = document.querySelectorAll("audio");
      audios.forEach((audio) => audio.addEventListener("play", handlePlay));
      return () => {
        audios.forEach((audio) => audio.removeEventListener("play", handlePlay));
      };
    }, 100);

    return () => clearTimeout(timeout);
  }, [songs]);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="section-container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          🎵 أغانينا
        </motion.h2>

        <p className="text-center text-muted-foreground font-body mb-10">
          الأغاني اللي بنحبها وبتفكرنا ببعض 🎶
        </p>

        <div className="max-w-md mx-auto space-y-4">
          {songs.map((song, index) => {
            const songUrl = song.audio_url || song.audioUrl;
            return (
              <motion.div
                key={song.id}
                className="romantic-card flex flex-col items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full romantic-gradient flex items-center justify-center shrink-0">
                    <Music className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <h4 className="font-body font-bold text-foreground truncate">{song.title}</h4>
                    {song.artist && (
                      <p className="text-sm text-muted-foreground font-body truncate">{song.artist}</p>
                    )}
                  </div>
                </div>
                {songUrl && (
                  <div className="w-full mt-2">
                    <MusicPlayer audioUrl={songUrl} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Playlist;
