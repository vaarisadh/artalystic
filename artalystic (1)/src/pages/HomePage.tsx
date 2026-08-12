import React from 'react';
import { useArt } from '../context/ArtContext';
import { Category } from '../types';
import { ArtworkCard } from '../components/ArtworkCard';
import { ArrowUpRight, Palette, Sparkles, Compass, Brush, Cpu, Hand, Mail } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { artworks, setActiveTab, setSelectedCategory, setSelectedArtwork } = useArt();

  const featuredArtworks = artworks.filter((a) => a.featured).slice(0, 6);
  const heroArtwork = featuredArtworks[0] || artworks[0];
  const heroImage = heroArtwork?.imageUrl || (heroArtwork as any)?.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop';
  const heroTitle = heroArtwork?.title || 'Echoes of Serenity';
  const heroArtist = heroArtwork?.artist || (heroArtwork as any)?.artistName || 'Evelyn Vane';

  const categories: { name: Category; desc: string; icon: React.ReactNode; image: string }[] = [
    {
      name: 'Traditional Art',
      desc: 'Oils, watercolors, acrylics, charcoal, and physical canvas masterworks.',
      icon: <Brush className="w-5 h-5 text-[#8B5E3C]" />,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Fan Art',
      desc: 'Original artistic homages celebrating pop culture, anime, and legendary characters.',
      icon: <Sparkles className="w-5 h-5 text-[#8B5E3C]" />,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Digital Art',
      desc: 'Digital paintings: fan art, portrait, etc.',
      icon: <Cpu className="w-5 h-5 text-[#8B5E3C]" />,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
    },
    {
      name: 'Handmade Art',
      desc: 'Hand-thrown ceramics, woven textiles, sculpted wood, and bespoke crafts.',
      icon: <Hand className="w-5 h-5 text-[#8B5E3C]" />,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const handleCategoryClick = (catName: Category) => {
    setSelectedCategory(catName);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-12 animate-in fade-in duration-300">
      
      {/* Aesthetic Hero Banner */}
      <section className="relative pt-4 sm:pt-6 lg:pt-8 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Subtle Decorative Backdrop Element */}
        <div className="absolute inset-0 -z-10 flex items-center justify-start pointer-events-none opacity-30">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#E8DFC0] via-[#F4EFEA] to-transparent filter blur-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start text-left">
          
          {/* Left Text & CTA Content */}
          <div className="lg:col-span-7 space-y-6 text-left pt-12 lg:pt-16">
            <h1 
              className="text-[#1C1B1A] tracking-tight text-left max-w-none"
              style={{
                fontSize: '58px',
                lineHeight: '64px',
                fontWeight: 'normal',
                fontFamily: "'Cormorant Garamond', serif"
              }}
            >
              Where Art finds its people
            </h1>

            <p className="text-base sm:text-lg text-[#665F55] font-light leading-relaxed max-w-xl text-left">
              Artalystic is a creative space for paintings, digital art, fan art, and handmade pieces.
            </p>

            {/* Minimalist CTA Buttons */}
            <div className="pt-10 sm:pt-12 flex flex-col sm:flex-row items-center justify-start gap-4">
              <button
                onClick={() => {
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ boxShadow: '-5px 6px 8px rgba(0, 0, 0, 0.25)' }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#3a2f26] hover:bg-[#4d4035] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all border border-[#4d4035] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Artwork</span>
                <Compass className="w-4 h-4 text-[#e7e2d7]" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('community');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ boxShadow: '-5px 6px 8px rgba(0, 0, 0, 0.25)' }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F2ECE4] hover:bg-[#E8DCCB] text-[#1C1B1A] text-xs font-semibold uppercase tracking-widest transition-all border border-[#E2DAD0] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Artist Collaboration</span>
                <ArrowUpRight className="w-4 h-4 text-[#8B5E3C]" />
              </button>
            </div>
          </div>

          {/* Right Featured Artwork Image Showcase */}
          <div className="lg:col-span-5 lg:pt-6 flex justify-center lg:justify-start lg:-ml-2">
            <div className="relative group w-full max-w-[380px] sm:max-w-[400px]">
              {/* Soft warm backdrop glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#e7e2d7]/30 via-[#E8DCCB]/40 to-[#8B5E3C]/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative bg-[#FAF8F5] p-2.5 rounded-3xl border border-[#E8E2D8] shadow-xl overflow-hidden">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#E8E2D8]">
                  <img
                    src={heroImage}
                    alt={heroTitle}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Artwork Caption Tag */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-md text-left flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#8B5E3C] block">
                        Featured Showcase
                      </span>
                      <h4 className="font-serif text-xs font-bold text-[#1C1B1A] truncate">
                        {heroTitle}
                      </h4>
                      <p className="text-[10px] text-[#665F55] truncate">
                        by {heroArtist}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (heroArtwork) {
                          setSelectedArtwork(heroArtwork);
                        } else {
                          setActiveTab('explore');
                        }
                      }}
                      className="p-2 rounded-lg bg-[#1C1B1A] text-[#FAF8F5] hover:bg-[#3a2f26] transition-colors shrink-0 cursor-pointer"
                      title="View Artwork Details"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#e7e2d7]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Featured Artworks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D8] gap-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-[#8B5E3C] block mb-1">
              Curated Masterworks
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
              Featured Artworks
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C] hover:text-[#1C1B1A] flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Artworks</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {featuredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8C8275] text-center py-12">
            No featured artworks available at the moment.
          </p>
        )}
      </section>

      {/* Category Quick Jumps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E2D8] gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
              Browse By Specific Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] p-5 cursor-pointer hover:shadow-lg hover:border-[#e7e2d7] transition-all duration-300 flex flex-col justify-between h-64 overflow-hidden"
            >
              {/* Background Thumbnail preview */}
              <div className="absolute inset-0 -z-10 opacity-15 group-hover:opacity-25 transition-opacity">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F2ECE4] border border-[#E2DAD0] flex items-center justify-center mb-4 group-hover:bg-[#1C1B1A] transition-colors">
                  {cat.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1B1A] group-hover:text-[#8B5E3C] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#665F55] mt-2 font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-[#8B5E3C] pt-4 border-t border-[#E8E2D8]">
                <span>Explore Works</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artist Collaboration Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#3a2f26] text-[#FAF8F5] p-8 sm:p-14 overflow-hidden shadow-2xl border border-[#4d4035] flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl">
            <h2 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
              Are you an artist? Collaborate with Artalystic.
            </h2>
            <p className="text-sm text-[#BFB7AB] leading-relaxed font-light">
              We welcome creators across Traditional Art, Fan Art, Digital Art, and Handmade Crafts. Submit your portfolio to showcase your works on our global portal.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => {
                setActiveTab('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-xl bg-[#FAF8F5] hover:bg-[#E8DCCB] text-[#1C1B1A] text-xs font-semibold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#8B5E3C]" />
              <span>Join Community & Submit Art</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
