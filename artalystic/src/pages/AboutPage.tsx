import React from 'react';
import { useArt } from '../context/ArtContext';
import { Palette, Heart, Users, Mail } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveTab } = useArt();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="text-center space-y-4 pt-8">
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1B1A]">
          About <span className="font-sans font-bold not-italic">Artalystic</span>
        </h1>
        <div className="space-y-4 text-base sm:text-lg text-[#665F55] max-w-2xl mx-auto font-light leading-relaxed">
          <p>
            Artalystic is a platform built around the idea that good artwork should be easy to discover. We bring independent artists and art lovers together in one place, creating a space where original artwork can be showcased, explored, and found by the people looking for it.
          </p>
          <p>
            From fanart and portraits to illustrations, paintings, digital work, and other creative pieces, Artalystic is open to different styles, mediums, and ways of creating.
          </p>
        </div>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F2ECE4] border border-[#E2DAD0] flex items-center justify-center text-[#8B5E3C]">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1A]">
            Respect for Traditional & Digital Mediums
          </h3>
          <p className="text-xs text-[#665F55] leading-relaxed font-light">
            We bridge classic oil paintings, delicate watercolors, and ceramic craft with futuristic digital illustration and fan art homages. Every medium carries its own soul and story.
          </p>
        </div>

        <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F2ECE4] border border-[#E2DAD0] flex items-center justify-center text-[#8B5E3C]">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1A]">
            Artist-First Collaboration
          </h3>
          <p className="text-xs text-[#665F55] leading-relaxed font-light">
            Artalystic partners directly with independent painters, digital illustrators, and fan creators globally. We provide a clean, distraction-free space where artwork receives full focus.
          </p>
        </div>

        <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F2ECE4] border border-[#E2DAD0] flex items-center justify-center text-[#8B5E3C]">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1A]">
            Minimalist & Intuitive Design
          </h3>
          <p className="text-xs text-[#665F55] leading-relaxed font-light">
            Our platform intentionally avoids cluttered UI, invasive popups, and visual noise. We believe great art deserves generous whitespace, crisp typography, and quiet elegance.
          </p>
        </div>

        <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F2ECE4] border border-[#E2DAD0] flex items-center justify-center text-[#8B5E3C]">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1A]">
            Direct Artwork Email Details
          </h3>
          <p className="text-xs text-[#665F55] leading-relaxed font-light">
            Visitors can effortlessly request comprehensive digital dossiers, technique breakdowns, and high-resolution preview sheets directly sent to their inbox in seconds.
          </p>
        </div>

      </div>

      {/* Call to Action */}
      <div className="p-10 bg-[#F4EFEA] rounded-3xl border border-[#E8E2D8] text-center space-y-4">
        <h3 className="font-serif text-3xl font-bold text-[#1C1B1A]">
          Ready to Collaborate or Discover Works?
        </h3>
        <p className="text-xs text-[#665F55] max-w-lg mx-auto leading-relaxed">
          Whether you are an independent creator wanting to feature your traditional or digital art, or a collector seeking aesthetic inspiration, we welcome you.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              setActiveTab('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl bg-[#1C1B1A] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#33312E] transition-all"
          >
            Apply as Collaborator
          </button>
          <button
            onClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl bg-white border border-[#DCD3C7] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] transition-all"
          >
            Explore Gallery
          </button>
        </div>
      </div>

    </div>
  );
};
