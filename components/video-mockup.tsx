// components/video-mockup.tsx
"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface VideoMockupProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoMockup({ src, poster, className }: VideoMockupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={`group relative ${className}`}>
      {/* Mockup téléphone */}
      <div className="relative mx-auto w-full max-w-[300px] lg:max-w-[340px]">
        {/* Cadre téléphone */}
        <div className="relative rounded-[3rem] bg-gradient-to-b from-gray-800 via-gray-900 to-black p-3 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-primary/10">
          {/* Encoche iPhone */}
          <div className="absolute left-1/2 top-0 z-10 h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-black" />

          {/* Écran */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-black">
            {/* Vidéo */}
            <video
              ref={videoRef}
              className="aspect-[9/16] w-full object-cover"
              poster={poster}
              playsInline
              muted={isMuted}
              loop
              preload="metadata"
            >
              <source src={src} type="video/webm" />
              <source src={src.replace(".webm", ".mp4")} type="video/mp4" />
            </video>

            {/* Overlay interactif */}
            <div
              className="absolute inset-0 cursor-pointer transition-colors duration-300"
              onClick={handlePlayPause}
            >
              {/* Play button initial */}
              {!isPlaying && (
                <div className="flex h-full items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30">
                    <Play className="h-10 w-10 translate-x-0.5 fill-white text-white" />
                  </div>
                </div>
              )}

              {/* Contrôles en lecture */}
              {isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* Bouton mute/unmute */}
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Boutons latéraux iPhone */}
          <div className="absolute -right-1 top-20 h-12 w-1 rounded-l-lg bg-gray-700" />
          <div className="absolute -right-1 top-36 h-16 w-1 rounded-l-lg bg-gray-700" />
          <div className="absolute -left-1 top-24 h-8 w-1 rounded-r-lg bg-gray-700" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-b from-primary/20 to-primary/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
      </div>

      {/* Copy en dessous */}
      <div className="mt-8 text-center">
        <p className="text-base font-semibold text-foreground md:text-lg">
          See how I turn traffic into revenue
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Real walkthrough • 60 seconds • No fluff
        </p>
      </div>
    </div>
  );
}
