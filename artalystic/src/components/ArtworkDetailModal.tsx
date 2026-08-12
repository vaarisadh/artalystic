import React from 'react';
import { useArt } from '../context/ArtContext';
import { X, Mail, Calendar, Layers, Maximize2, Sparkles, Share2 } from 'lucide-react';

export const ArtworkDetailModal: React.FC = () => {
  const { selectedArtwork, setSelectedArtwork, setEmailModalArtwork, showToast } = useArt();

  if (!selectedArtwork) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Artwork showcase link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C1B1A]/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedArtwork(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1C1B1A]/60 text-white hover:bg-[#1C1B1A] transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Canvas */}
        <div className="md:w-1/2 bg-[#F2ECE4] relative min-h-[300px] md:min-h-[500px] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#E8E2D8]">
          <img
            src={selectedArtwork.imageUrl || (selectedArtwork as any).image}
            alt={selectedArtwork.title}
            className="w-full h-full max-h-[60vh] object-contain rounded-xl shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 z-10 bg-[#1C1B1A]/80 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[#e7e2d7]" /> High Resolution Showcase
          </div>
        </div>

        {/* Right Column: Metadata & Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#FAF8F5]">
          <div className="space-y-5">
            
            {/* Category & Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-[#F2ECE4] text-[#8B5E3C] border border-[#E2DAD0]">
                {selectedArtwork.category}
              </span>
              <div className="flex items-center gap-2">
                {selectedArtwork.available === false && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                    Sold / Unavailable
                  </span>
                )}
                {selectedArtwork.featured && (
                  <span className="flex items-center gap-1 text-xs text-[#8B5E3C] font-medium">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Piece
                  </span>
                )}
              </div>
            </div>

            {/* Title & Artist */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A] leading-tight">
                {selectedArtwork.title}
              </h2>
              <p className="text-base font-medium text-[#8B5E3C] mt-1">
                by {selectedArtwork.artist}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#E8E2D8] text-xs">
              <div className="flex items-center gap-2 text-[#665F55]">
                <Layers className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="block text-[10px] text-[#A39B8E] uppercase tracking-wider">Medium</span>
                  <span className="font-medium text-[#1C1B1A]">{selectedArtwork.medium}</span>
                </div>
              </div>

              {selectedArtwork.dimensions && (
                <div className="flex items-center gap-2 text-[#665F55]">
                  <Maximize2 className="w-4 h-4 text-[#8B5E3C]" />
                  <div>
                    <span className="block text-[10px] text-[#A39B8E] uppercase tracking-wider">Dimensions</span>
                    <span className="font-medium text-[#1C1B1A]">{selectedArtwork.dimensions}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-[#665F55]">
                <Calendar className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="block text-[10px] text-[#A39B8E] uppercase tracking-wider">Year Created</span>
                  <span className="font-medium text-[#1C1B1A]">{selectedArtwork.year}</span>
                </div>
              </div>
            </div>

            {/* Description & Story */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#A39B8E] font-semibold mb-1">
                  About the Artwork
                </h4>
                <p className="text-sm text-[#4A453E] leading-relaxed font-light">
                  {selectedArtwork.description}
                </p>
              </div>

              {selectedArtwork.story && (
                <div className="p-3.5 bg-[#F4EFEA] rounded-xl border border-[#E2DAD0] text-xs text-[#524B42]">
                  <span className="block font-semibold text-[#8B5E3C] mb-1">
                    Artist's Note & Inspiration:
                  </span>
                  <p className="italic leading-relaxed font-serif text-sm">
                    "{selectedArtwork.story}"
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-[#E8E2D8] space-y-3">
            <button
              onClick={() => {
                setSelectedArtwork(null);
                setEmailModalArtwork(selectedArtwork);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#3a2f26] hover:bg-[#4d4035] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
            >
              <Mail className="w-4 h-4 text-[#e7e2d7]" />
              <span>Get Artwork Details via Email</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#F2ECE4] hover:bg-[#E2DAD0] text-[#524B42] text-xs font-medium transition-colors border border-[#E2DAD0]"
              >
                <Share2 className="w-4 h-4 text-[#8B5E3C]" />
                <span>Share Showcase Link</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
