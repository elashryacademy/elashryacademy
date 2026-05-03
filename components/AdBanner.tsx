"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  position: string;
  className?: string;
}

export default function AdBanner({ position, className }: AdBannerProps) {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ads/${position}`)
      .then(res => res.json())
      .then(data => {
        setAds(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [position]);

  if (loading || ads.length === 0) return null;

  // For simplicity, we show the latest active ad for that position
  const activeAd = ads[0];

  return (
    <div className={cn("w-full overflow-hidden rounded-[2rem]", className)}>
      {activeAd.script ? (
        <div 
          className="ad-script-container"
          dangerouslySetInnerHTML={{ __html: activeAd.script }} 
        />
      ) : activeAd.image ? (
        <Link 
          href={activeAd.link || "#"} 
          target={activeAd.link?.startsWith("http") ? "_blank" : "_self"}
          className="block group relative"
        >
          <img 
            src={activeAd.image} 
            alt={activeAd.title || "Advertisement"} 
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {activeAd.title && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/90 dark:bg-black/80 px-4 py-2 rounded-xl text-xs font-black shadow-xl">
                {activeAd.title}
              </span>
            </div>
          )}
        </Link>
      ) : null}
    </div>
  );
}
