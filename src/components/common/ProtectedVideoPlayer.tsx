import React, { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, CheckCircle } from 'lucide-react';

interface ProtectedVideoPlayerProps {
  videoId: string;
  onEnded?: () => void;
  isCompleted?: boolean;
}

export const ProtectedVideoPlayer: React.FC<ProtectedVideoPlayerProps> = ({ videoId, onEnded, isCompleted }) => {
  const { user, profile } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Bunny.net iframe URL xavfsiz sozlamalari bilan
  const videoUrl = `https://iframe.mediadelivery.net/embed/380785/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group select-none">
      {/* Dynamic Watermark (Ekran yozib olishni qiyinlashtiruvchi suv belgisi) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700/50 text-[10px] text-slate-300 flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-indigo-400" />
          <span>{profile?.first_name || user?.email || 'Himoyalangan dars'}</span>
        </div>
      </div>

      {/* Video Player Frame */}
      <iframe
        ref={iframeRef}
        src={videoUrl}
        loading="lazy"
        className="w-full h-full border-0 pointer-events-auto"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        onEnded={onEnded}
      />

      {/* Context Menu / Download Disable Shield */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Completion Overlay Banner */}
      {isCompleted && (
        <div className="absolute top-4 left-4 z-20 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Dars bajarilgan</span>
        </div>
      )}
    </div>
  );
};
