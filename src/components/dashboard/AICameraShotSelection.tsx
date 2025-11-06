'use client';

import { useState } from 'react';
import { DotsIcon, ChevronIcon } from '@/components/Icons';

export default function AICameraShotSelection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    // Placeholder for navigation
    setCurrentImageIndex((prev) => prev + 1);
  };

  const prevImage = () => {
    // Placeholder for navigation
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-black rounded-3xl p-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-black text-xl tracking-tight">AI Camera</h3>
        <button className="text-white/40 hover:text-emerald-400 transition-colors p-2 hover:bg-emerald-500/10 rounded-lg">
          <DotsIcon />
        </button>
      </div>

      {/* Image/Analysis Area */}
      <div className="relative h-80 rounded-2xl overflow-hidden border border-white/10">
        {/* Cricket Field Background */}
        <div className="absolute inset-0">
          {/* Green field gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-800 via-green-700 to-green-900" />
          
          {/* Field pattern */}
          <div className="absolute inset-0">
            {/* Pitch area */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-2/3 bg-gradient-to-b from-yellow-900/20 to-amber-900/30" />
            
            {/* Field lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            <div className="absolute bottom-1/4 left-0 right-0 h-px bg-white/5" />
          </div>
          
          {/* Player silhouette in batting stance */}
          <div className="absolute bottom-1/4 right-1/3 transform">
            {/* Body */}
            <div className="relative">
              <div className="w-16 h-24 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-full" />
              {/* Bat */}
              <div className="absolute -right-6 top-8 w-20 h-2 bg-yellow-900/40 transform -rotate-45 origin-left" />
              {/* Shadow */}
              <div className="absolute -bottom-1 left-0 w-16 h-2 bg-black/40 blur-sm rounded-full" />
            </div>
          </div>
          
          {/* Stadium background blur */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-gray-800/60 to-transparent backdrop-blur-sm" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-500/60 flex items-center justify-center transition-all duration-300 hover:bg-emerald-950/80 hover:scale-110 shadow-lg shadow-emerald-500/10"
        >
          <ChevronIcon className="w-5 h-5 text-emerald-400 rotate-90" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-500/60 flex items-center justify-center transition-all duration-300 hover:bg-emerald-950/80 hover:scale-110 shadow-lg shadow-emerald-500/10"
        >
          <ChevronIcon className="w-5 h-5 text-emerald-400 -rotate-90" />
        </button>
      </div>

      {/* Stats Section */}
      <div className="mt-6 bg-gradient-to-br from-emerald-950/30 to-black rounded-2xl p-5 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          {/* Shot Selection Label */}
          <div>
            <p className="text-white font-black text-base leading-tight">Shot</p>
            <p className="text-white font-black text-base">Selection</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-emerald-400 text-3xl font-black drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">72%</p>
              <p className="text-white/80 text-xs mt-1 font-bold">Optimal</p>
            </div>

            <div className="w-px h-12 bg-emerald-500/30" />

            <div className="text-center">
              <p className="text-emerald-400 text-3xl font-black drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">72%</p>
              <p className="text-white/80 text-xs mt-1 font-bold">Choices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
