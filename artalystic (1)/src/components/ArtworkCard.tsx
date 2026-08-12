import React from 'react';
import { Artwork } from '../types';
import { useArt } from '../context/ArtContext';
import { Mail, Sparkles } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const { setSelectedArtwork, setEmailModalArtwork } = useArt();

  // Category badge colors
  const categoryStyles: Record<string, string> = {
    'Traditional Art': 'bg-[#F2ECE4] text-[#705238] border-[#E2DAD0]',
    'Fan Art': 'bg-[#EEF2F6] text-[#2C5282] border-[#DCE3EC]',
    'Digital Art': 'bg-[#F4EFEA] text-[#805AD5] border-[#E9DFD8]',
    'Handmade Art': 'bg-[#F0F2ED] text-[#4A5D4E] border-[#DCE2D9]',
  };

  return (
    <div className="group relative bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Image Banner */}
      <div 
        onClick={() => setSelectedArtwork(artwork)}
        className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#F2ECE4] cursor-pointer"
      >
        <img
          src={artwork.imageUrl || (artwork as any).image}
          alt={artwork.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full border shadow-sm ${categoryStyles[artwork.category] || 'bg-white/90 text-gray-800'}`}>
            {artwork.category}
          </span>
        </div>

        {/* Featured Star Badge */}
        {artwork.featured && (
          <div className="absolute top-3 right-3 z-10 bg-[#1C1B1A]/80 text-[#E8DCCB] backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-widest flex items-center gap-1 border border-[#33312E]">
            <Sparkles className="w-3 h-3 text-[#e7e2d7]" /> Featured
          </div>
        )}

        {/* Sold / Availability Tag */}
        {artwork.available === false && (
          <div className="absolute bottom-3 left-3 z-10 bg-rose-950/85 text-rose-100 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-rose-800 shadow-xs">
            Sold
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-[#FAF8F5]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => setSelectedArtwork(artwork)}
              className="font-serif text-xl font-semibold text-[#1C1B1A] hover:text-[#8B5E3C] transition-colors cursor-pointer line-clamp-1"
            >
              {artwork.title}
            </h3>
          </div>

          <p className="text-xs text-[#8B5E3C] font-medium tracking-wide mt-0.5">
            by {artwork.artist}
          </p>

          <p className="text-xs text-[#665F55] mt-2.5 line-clamp-2 leading-relaxed font-light">
            {artwork.description}
          </p>
        </div>

        {/* Bottom Specs & Email Action */}
        <div className="pt-4 mt-4 border-t border-[#E8E2D8] flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#8C8275] truncate">
            {artwork.dimensions || artwork.year}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmailModalArtwork(artwork)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2ECE4] hover:bg-[#E8DCCB] text-[#524B42] hover:text-[#1C1B1A] text-xs font-medium transition-all border border-[#E2DAD0]"
              title="Get artwork details via email"
            >
              <Mail className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>Get Details</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
