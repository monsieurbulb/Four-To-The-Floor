import React, { useRef, useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Activity, Radio, Sun } from 'lucide-react';

const HOLDING_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeCode, setTimeCode] = useState(new Date().toLocaleTimeString());

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const interval = setInterval(() => {
        const now = new Date();
        setTimeCode(now.toLocaleTimeString([], { hour12: false }));
    }, 1000);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-bark group overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[40px]"
    >
      {/* Video Element - Natural/Clear */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover opacity-90 transition-opacity duration-1000" 
        autoPlay
        loop
        muted
        playsInline
        poster={HOLDING_IMAGE}
        src="https://videos.pexels.com/video-files/6981411/6981411-uhd_2160_3840_25fps.mp4" 
      />

      {/* Layer: Vignette (Softer) */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle at center, transparent 50%, rgba(12,10,9,0.6) 100%) z-10"></div>

      {/* HUD: Minimal & Organic */}
      <div className="absolute inset-0 p-6 md:p-8 pointer-events-none z-30 flex flex-col justify-between">
         {/* Top Bar */}
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-breathe"></div>
                <span className="text-sand/80 font-mono text-xs tracking-widest uppercase">Live Signal</span>
            </div>
            
            <div className="flex flex-col items-end gap-1 opacity-70">
                 <div className="flex items-center gap-2 text-sand/80 font-mono text-xs">
                    <Activity className="w-3 h-3 text-moss" />
                    <span>STABLE</span>
                 </div>
                 <div className="text-[10px] text-sand/50 font-mono">
                    {timeCode} UTC
                 </div>
            </div>
         </div>

         {/* Bottom Controls Area (Hover Only) */}
         <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0 z-40 flex justify-between items-end">
            <div className="flex flex-col">
               <h2 className="text-sand font-mono text-2xl font-bold tracking-tight drop-shadow-md">
                  FOUR_TO_THE_FLOOR
               </h2>
               <p className="text-moss text-[10px] font-mono tracking-widest flex items-center gap-2 uppercase mt-1">
                 <Sun size={10} /> Organic Connection
               </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMute}
                className="p-3 bg-bark/60 hover:bg-moss hover:text-bark text-sand border border-white/10 rounded-full transition-all duration-300 backdrop-blur-md"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="p-3 bg-bark/60 hover:bg-moss hover:text-bark text-sand border border-white/10 rounded-full transition-all duration-300 backdrop-blur-md"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};