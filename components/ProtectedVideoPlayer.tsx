"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProtectedVideoPlayerProps {
  url: string;
  user: {
    name: string;
    studentCode?: string;
  };
}

export default function ProtectedVideoPlayer({ url, user }: ProtectedVideoPlayerProps) {
  const [watermarkPos, setWatermarkPos] = useState({ top: 10, left: 10 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Random position for watermark, ensuring it stays within bounds
        const top = Math.random() * (clientHeight - 100);
        const left = Math.random() * (clientWidth - 200);
        setWatermarkPos({ top, left });
      }
    }, 5000); // Change position every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Prevent right-click on video container
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const embedUrl = url.includes("youtube.com") || url.includes("youtu.be") 
    ? url.replace("watch?v=", "embed/").split('&')[0] + "?modestbranding=1&rel=0&iv_load_policy=3"
    : url;

  return (
    <div 
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 group select-none"
    >
      <iframe 
        src={embedUrl}
        className="w-full h-full pointer-events-auto"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
      
      {/* Overlay to prevent some interactions and help with watermarking */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Watermark */}
        <div 
          className="absolute transition-all duration-1000 ease-in-out opacity-20 dark:opacity-30"
          style={{ 
            top: `${watermarkPos.top}px`, 
            left: `${watermarkPos.left}px` 
          }}
        >
          <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
            <p className="text-[10px] font-black text-white/50 tracking-widest uppercase">Property of El Ashry Academy</p>
            <p className="text-sm font-black text-white/80">{user.name}</p>
            {user.studentCode && (
              <p className="text-xs font-bold text-blue-400">ID: {user.studentCode}</p>
            )}
          </div>
        </div>

        {/* Static small watermarks in corners */}
        <div className="absolute bottom-6 right-8 opacity-10">
          <p className="text-[8px] font-black text-white uppercase tracking-tighter">{user.studentCode || user.name}</p>
        </div>
        <div className="absolute top-6 left-8 opacity-10">
          <p className="text-[8px] font-black text-white uppercase tracking-tighter">{user.studentCode || user.name}</p>
        </div>
      </div>

      {/* Full screen protection hint */}
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>
    </div>
  );
}
