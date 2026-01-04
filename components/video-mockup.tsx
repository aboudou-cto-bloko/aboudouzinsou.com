// components/video-mockup.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface VideoMockupProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoMockup({ src, poster, className }: VideoMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Autoplay/Autopause au scroll
  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasUserInteracted) {
          if (entry.isIntersecting) {
            videoRef.current
              ?.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasUserInteracted]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    setHasUserInteracted(true);

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
    <div ref={containerRef} className={`group relative z-0 ${className}`}>
      {/* Mockup iPhone */}
      <div className="relative mx-auto w-full max-w-[300px] lg:max-w-[340px]">
        {/* Cadre téléphone avec ombres réalistes */}
        <div className="relative rounded-[3rem] bg-gradient-to-b from-gray-800 via-gray-900 to-black p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.7)]">
          <div className="absolute left-1/2 top-0 z-20 flex h-7 w-32 -translate-x-1/2 items-center justify-center rounded-b-[1.75rem] bg-black">
            <div className="flex items-center gap-2.5">
              {/* Caméra */}
              <div className="h-1.5 w-1.5 rounded-full bg-gray-800 ring-1 ring-gray-700" />
              {/* Capteur */}
              <div className="h-2.5 w-14 rounded-full bg-gray-950" />
            </div>
          </div>

          {/* Écran avec overflow parfait */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-black">
            {/* Container vidéo avec coins arrondis parfaits */}
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={poster}
                playsInline
                muted={isMuted}
                loop
                preload="metadata"
              >
                <source src={src} type="video/webm" />
                <source src={src.replace(".webm", ".mp4")} type="video/mp4" />
              </video>
              {/* Dans l'écran, après la vidéo */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.02] opacity-60" />
              <div className="scan-line pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <style jsx>{`
                @keyframes scan {
                  0%,
                  100% {
                    top: 0%;
                    opacity: 0;
                  }
                  10% {
                    opacity: 1;
                  }
                  90% {
                    opacity: 1;
                  }
                  100% {
                    top: 100%;
                    opacity: 0;
                  }
                }
                .scan-line {
                  animation: scan 8s ease-in-out infinite;
                }
              `}</style>
            </div>

            {/* Overlay contrôles */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={handlePlayPause}
            >
              {/* Play button moderne */}
              {!isPlaying && (
                <div className="flex h-full items-center justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="group/play relative">
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-500 group-hover/play:bg-primary/40 group-hover/play:blur-2xl" />

                    {/* Button */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-300 group-hover/play:scale-110 group-hover/play:border-white/20 group-hover/play:bg-white/20">
                      <Play className="h-9 w-9 translate-x-0.5 fill-white text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              )}

              {/* Contrôles en lecture */}
              {isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={toggleMute}
                    className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all hover:scale-110 hover:border-white/20 hover:bg-black/60"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-white drop-shadow" />
                    ) : (
                      <Volume2 className="h-5 w-5 text-white drop-shadow" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Boutons latéraux réalistes */}
          <div className="absolute -right-[2px] top-20 h-12 w-[3px] rounded-l-md bg-gray-700/80 shadow-inner" />
          <div className="absolute -right-[2px] top-36 h-16 w-[3px] rounded-l-md bg-gray-700/80 shadow-inner" />
          <div className="absolute -left-[2px] top-24 h-10 w-[3px] rounded-r-md bg-gray-700/80 shadow-inner" />
        </div>

        {/* Glow effect subtil */}
        <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent opacity-0 blur-[60px] transition-opacity duration-700 group-hover:opacity-70" />
      </div>

      {/* Copy dessous */}
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
