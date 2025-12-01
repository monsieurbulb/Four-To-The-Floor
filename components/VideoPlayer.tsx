
import React, { useRef, useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Bell, Check } from 'lucide-react';
import { User, Asset } from '../types';
import { ASSETS } from '../constants';

// Using a placeholder abstract purple video if no Livepeer ID is provided
const DEFAULT_VIDEO = ASSETS.defaultVideo;
const HOLDING_IMAGE = ASSETS.holdingImage;

interface VideoPlayerProps {
  playbackId?: string;
  user?: User; // Needed to check inventory for reactions
  onUseAsset?: (assetId: string) => void; // Callback to decrement count
  onSubscribe?: () => void; // Callback to award points
}

declare global {
  interface Window {
    Hls: any;
  }
}

interface FloatingEmoji {
    id: number;
    icon: string;
    x: number;
    y: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ playbackId, user, onUseAsset, onSubscribe }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeCode, setTimeCode] = useState(new Date().toLocaleTimeString());
  
  // Reaction Animations
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

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

  const handleSubscribe = () => {
      if (isSubscribed) return;
      setIsSubscribed(true);
      if (onSubscribe) onSubscribe();
  };

  const triggerReaction = (asset: Asset) => {
      if (asset.quantity <= 0) return;
      if (onUseAsset) onUseAsset(asset.id);

      // Create visual effect
      const newEmoji: FloatingEmoji = {
          id: Date.now(),
          icon: asset.icon,
          x: 20 + Math.random() * 60, // Random X pos between 20-80%
          y: 80 // Start near bottom
      };

      setFloatingEmojis(prev => [...prev, newEmoji]);

      // Remove after animation
      setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
      }, 2000);
  };

  // Setup HLS for Livepeer or fallback to standard MP4
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: any;

    if (playbackId) {
      const source = `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
      
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = source;
      }
    } else {
      // Fallback to default MP4
      video.src = DEFAULT_VIDEO;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [playbackId]);

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
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover opacity-90 transition-opacity duration-1000" 
        autoPlay
        loop
        muted
        playsInline
        poster={HOLDING_IMAGE}
      />

      {/* Floating Emojis Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {floatingEmojis.map(emoji => (
              <div 
                key={emoji.id}
                className="absolute text-4xl animate-float-up opacity-0"
                style={{ 
                    left: `${emoji.x}%`, 
                    bottom: '10%',
                    animation: 'floatUp 2s ease-out forwards'
                }}
              >
                  {emoji.icon}
              </div>
          ))}
          <style>{`
            @keyframes floatUp {
                0% { transform: translateY(0) scale(0.5); opacity: 1; }
                100% { transform: translateY(-300px) scale(1.5); opacity: 0; }
            }
          `}</style>
      </div>

      {/* Layer: Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle at center, transparent 50%, rgba(12,10,9,0.6) 100%) z-10"></div>

      {/* HUD: Minimal & Organic */}
      <div className="absolute inset-0 p-6 md:p-8 pointer-events-none z-30 flex flex-col justify-between">
         {/* Top Bar */}
         <div className="flex justify-between items-start pointer-events-auto">
            <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full">
                <div className={`w-2 h-2 ${playbackId ? 'bg-red-500' : 'bg-moss'} rounded-full animate-breathe`}></div>
                <span className="text-sand/80 font-mono text-xs tracking-widest uppercase">
                  {playbackId ? 'LIVE FEED' : 'AMBIENT SIGNAL'}
                </span>
            </div>
            
            <button 
                onClick={handleSubscribe}
                disabled={isSubscribed}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all
                    ${isSubscribed 
                        ? 'bg-moss text-bark cursor-default' 
                        : 'bg-black/40 border border-white/10 text-sand hover:bg-moss/20'
                    }
                `}
            >
                 {isSubscribed ? <Check size={12} /> : <Bell size={12} />}
                 {isSubscribed ? 'Subscribed' : 'Subscribe (+50 PTS)'}
            </button>
         </div>

         {/* Center Info (Optional) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
             {user && (
                 <div className="text-[10px] font-mono text-moss uppercase tracking-[0.5em] mb-2">Live Reaction Enabled</div>
             )}
         </div>

         {/* Bottom Controls Area */}
         <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0 z-40 flex justify-between items-end pointer-events-auto">
            <div className="flex flex-col">
               <h2 className="text-sand font-mono text-2xl font-bold tracking-tight drop-shadow-md">
                  FOUR_TO_THE_FLOOR
               </h2>
               <div className="flex items-center gap-4 mt-2">
                   {/* REACTION BAR */}
                   {user && user.assets && (
                       <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/5">
                           {user.assets.filter(a => a.type === 'emoji').map(asset => (
                               <button
                                 key={asset.id}
                                 onClick={() => triggerReaction(asset)}
                                 disabled={asset.quantity <= 0}
                                 className={`
                                    relative w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90
                                    ${asset.quantity > 0 ? 'hover:bg-white/10 cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                                 `}
                                 title={`${asset.name} (${asset.quantity} left)`}
                               >
                                   <span className="text-xl">{asset.icon}</span>
                                   <span className="absolute -top-1 -right-1 bg-moss text-bark text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-bark">
                                       {asset.quantity}
                                   </span>
                               </button>
                           ))}
                           {user.assets.length === 0 && (
                               <span className="text-[9px] font-mono text-stone-500 px-2">No Reactions</span>
                           )}
                       </div>
                   )}
               </div>
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
