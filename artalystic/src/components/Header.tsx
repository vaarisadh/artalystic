import React, { useState } from 'react';
import { useArt } from '../context/ArtContext';
import { Menu, X, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin, setIsAdmin } = useArt();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Artwork' },
    { id: 'about', label: 'About Us' },
    { id: 'community', label: 'Join Our Community' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ded9cf]/90 backdrop-blur-md border-b border-[#c8c2b6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center"
          >
            <span 
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1B1A] group-hover:text-[#8B5E3C] transition-colors font-sans"
            >
              Artalystic
            </span>
          </div>

          {/* Desktop Navigation aligned to right */}
          <nav className="hidden md:flex items-center space-x-8 ml-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-2 text-sm tracking-wide font-medium transition-colors ${
                    isActive
                      ? 'text-[#1C1B1A] font-semibold'
                      : 'text-[#665F55] hover:text-[#1C1B1A]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B5E3C] rounded-full animate-in fade-in zoom-in-95 duration-200" />
                  )}
                </button>
              );
            })}
          </nav>


          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1C1B1A] hover:bg-[#F0EAE1] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8E2D8] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-[#E8DFC0]/40 text-[#1C1B1A] font-semibold'
                  : 'text-[#524B42] hover:bg-[#F2ECE4]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E8E2D8]">
            <button
              onClick={() => {
                setIsAdmin(true);
                handleNavClick('admin');
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#1C1B1A] bg-[#F2ECE4] hover:bg-[#E2DAD0]"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e7e2d7]" />
                Admin / Owner Portal
              </span>
              <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
