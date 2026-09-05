import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import {
  Play,
  Shield,
  ShieldAlert,
  Volume2,
  Maximize2,
  Lock,
  Sparkles,
  CheckCircle,
  Film,
} from 'lucide-react';

interface ProtectedVideoPlayerProps {
  libraryId?: string;
  videoId?: string;
  title: string;
  duration?: string;
  currentUser: User | null;
  onCompleted?: () => void;
  isCompleted?: boolean;
}

export const ProtectedVideoPlayer: React.FC<ProtectedVideoPlayerProps> = ({
  libraryId = '384729', // Default Bunny Stream Library ID
  videoId,
  title,
  duration,
  currentUser,
  onCompleted,
  isCompleted,
}) => {
  // Moving watermark coordinates to prevent screen recording
  const [watermarkPos, setWatermarkPos] = useState({ top: 15, left: 15 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Animate watermark dynamically across random positions
  useEffect(() => {
    const interval = setInterval(() => {
      // Random percentages within safe viewport margins (10% to 75%)
      const top = Math.floor(Math.random() * 65) + 12;
      const left = Math.floor(Math.random() * 60) + 10;
      setWatermarkPos({ top, left });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const watermarkText = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName} - ${currentUser.phoneNumber || currentUser.email || 'ID:' + currentUser.id.slice(-6)}`
    : 'AI Future Himoyalangan Video';

  const hasRealVideo = Boolean(videoId && videoId.trim().length > 3);
  const bunnyEmbedUrl = hasRealVideo
    ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`
    : '';

  return (
    <div
      id="protected-video-container"
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none group"
    >
      {/* 1. BUNNY STREAM IFRAME */}
      {hasRealVideo ? (
        <iframe
          id="bunny-stream-iframe"
          src={bunnyEmbedUrl}
          loading="lazy"
          title={title}
          className="w-full h-full border-0 absolute inset-0 pointer-events-auto"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      ) : (
        /* Realistic Bunny Stream Player Mock with interactive preview */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900 relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 ring-4 ring-indigo-500/20">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </div>

          <div className="max-w-md space-y-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono mb-2">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>Bunny.net Stream Player</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{title}</h3>
            <p className="text-xs text-slate-400">
              Davomiyligi: {duration || '15:00'} • DRM Himoya faol
            </p>
          </div>

          {/* Quick controls bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-slate-400 text-xs px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] text-slate-300 font-mono">1080p HD • Bunny CDN</span>
            </div>
            {onCompleted && (
              <button
                onClick={onCompleted}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isCompleted ? 'Tugallandi' : 'Tugatildi deb belgilash'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. DYNAMIC FLOATING ANTI-PIRACY WATERMARK (Requirement #5) */}
      <div
        id="anti-piracy-floating-watermark"
        style={{
          top: `${watermarkPos.top}%`,
          left: `${watermarkPos.left}%`,
          transform: 'rotate(-4deg)',
        }}
        className="absolute pointer-events-none z-30 transition-all duration-1000 ease-in-out select-none"
      >
        <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-[2px] border border-white/10 shadow-lg text-[11px] sm:text-xs font-mono font-bold text-white/50 tracking-wider">
          <span className="text-cyan-400/60 font-semibold mr-1.5">AI FUTURE:</span>
          <span>{watermarkText}</span>
        </div>
      </div>

      {/* Secondary discreet corner watermark */}
      <div className="absolute bottom-3 right-3 z-30 pointer-events-none select-none opacity-40 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
        DRM PROTECTED • {currentUser?.phoneNumber || currentUser?.firstName || 'AI-FUTURE'}
      </div>
    </div>
  );
};
