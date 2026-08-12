import React from 'react';
import { useArt } from '../context/ArtContext';
import { Heart, ShieldCheck, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, isAdmin, setIsAdmin } = useArt();

  return (
    <footer className="bg-[#3a2f26] text-[#E6E1DA] py-10 border-t border-[#4d4035] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#4d4035]/60 text-xs text-[#C5BCB0]">
          <div>
            <h4 className="font-serif text-base font-bold text-[#FAF8F5]">Artalystic Gallery</h4>
            <p className="text-[11px] text-[#A3988C] mt-0.5">Connecting visionary creators with art lovers worldwide.</p>
          </div>

          {/* Quick Contact Badges */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.instagram.com/vaariartspace"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2d241d] hover:bg-[#45372c] text-[#FAF8F5] transition-all border border-[#4d4035]"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              <span>@vaariartspace</span>
            </a>
            <a
              href="mailto:vaariartspace@gmail.com"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2d241d] hover:bg-[#45372c] text-[#FAF8F5] transition-all border border-[#4d4035]"
            >
              <Mail className="w-3.5 h-3.5 text-[#C18C5D]" />
              <span>vaariartspace@gmail.com</span>
            </a>
            <button
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-[#E6E1DA] hover:text-white underline font-medium cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Bottom copyright & admin shortcut */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8275] gap-4">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Artalystic. Crafted with</span>
            <Heart className="w-3 h-3 text-[#e7e2d7] fill-[#e7e2d7]" />
            <span>for artists globally.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (!isAdmin) {
                  setIsAdmin(true);
                }
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all border bg-[#2d241d] text-[#E6E1DA] border-[#4d4035] hover:bg-[#45372c] hover:text-[#FAF8F5] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#e7e2d7]" />
              <span>Owner Portal</span>
              {isAdmin && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
