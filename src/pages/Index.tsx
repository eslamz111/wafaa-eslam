import { useState } from "react";
import Hero from "@/components/Hero";
import OurStory from "@/components/OurStory";
import Countdown from "@/components/Countdown";
import YouAreMyPeace from "@/components/YouAreMyPeace";
import PhotoGallery from "@/components/PhotoGallery";
import LoveNotes from "@/components/LoveNotes";
import VideoGallery from "@/components/VideoGallery";
import Playlist from "@/components/Playlist";
import SecretButton from "@/components/SecretButton";
import Footer from "@/components/Footer";
import PasswordLock from "@/components/PasswordLock";
import Timeline from "@/components/Timeline";
import Promises from "@/components/Promises";
import PersonalVideo from "@/components/PersonalVideo";
import Dreams from "@/components/Dreams";
import WhyILoveYou from "@/components/WhyILoveYou";
import MusicPlayer from "@/components/MusicPlayer";
import FinalSection from "@/components/FinalSection";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";

const Index = () => {
  const [unlocked, setUnlocked] = useState(false);

  // Get the favorite song for auto-play
  const { data: songs } = useFirestoreCollection<{
    id: string;
    title?: string;
    audio_url?: string;
    audioUrl?: string;
    isFavorite?: boolean;
  }>("songs");

  const favoriteSong = songs.find((s) => s.isFavorite) || songs[0];

  const { data: settingsData } = useFirestoreDoc<{ anniversaryDate?: string }>("settings", "anniversaryDate");
  const { data: storyData } = useFirestoreDoc<{ text?: string; milestones?: any[] }>("settings", "storyText");
  const { data: timelineItems } = useFirestoreCollection("timeline");
  const { data: peaceData } = useFirestoreDoc<{ lines?: string[] }>("settings", "peace");
  const { data: promisesItems } = useFirestoreCollection("promises");
  const { data: galleryItems } = useFirestoreCollection("gallery");
  const { data: loveNoteItems } = useFirestoreCollection("loveNotes");
  const { data: whyItems } = useFirestoreCollection("whyILoveYou");
  const { data: videoItems } = useFirestoreCollection("videos");
  const { data: videoData } = useFirestoreDoc<{ youtubeUrl?: string }>("settings", "personalVideo");
  const { data: dreamItems } = useFirestoreCollection("futurePlans");
  const { data: secretData } = useFirestoreDoc<{ modalText?: string }>("settings", "secretMessage");

  if (!unlocked) {
    return <PasswordLock onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Hero>
        <MusicPlayer
          audioUrl={favoriteSong?.audio_url || favoriteSong?.audioUrl}
          songTitle={favoriteSong?.title}
          autoPlay={true}
        />
      </Hero>
      {!!settingsData?.anniversaryDate && <Countdown />}
      {(!!storyData?.text || !!storyData?.milestones?.length) && <OurStory />}
      {!!timelineItems?.length && <Timeline />}
      {!!peaceData?.lines?.length && <YouAreMyPeace />}
      {!!promisesItems?.length && <Promises />}
      {!!galleryItems?.length && <PhotoGallery />}
      {!!loveNoteItems?.length && <LoveNotes />}
      {!!whyItems?.length && <WhyILoveYou />}
      {!!videoItems?.length && <VideoGallery />}
      {!!videoData?.youtubeUrl && <PersonalVideo />}
      {!!dreamItems?.length && <Dreams />}
      {!!songs?.length && <Playlist />}
      {!!secretData?.modalText && <SecretButton />}
      <FinalSection />
      <Footer />

    </div>
  );
};

export default Index;
