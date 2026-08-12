import React, { useMemo } from 'react';
import { useArt } from '../context/ArtContext';
import { Category } from '../types';
import { ArtworkCard } from '../components/ArtworkCard';
import { Search, X, SlidersHorizontal, Grid, LayoutGrid } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const {
    artworks,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useArt();

  const [cols, setCols] = React.useState<3 | 4>(3);

  const categories: (Category | 'All')[] = [
    'All',
    'Traditional Art',
    'Fan Art',
    'Digital Art',
    'Handmade Art'
  ];

  // Filter logic
  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const matchesCategory =
        selectedCategory === 'All' || art.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.artist.toLowerCase().includes(q) ||
        art.medium.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [artworks, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto pt-6 space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B1A]">
          Explore Artwork
        </h1>
        <p className="text-sm text-[#665F55] font-light leading-relaxed">
          Filter through traditional paintings, fan art homages, digital illustrations, and handmade creations. Click any piece to view details or request a dossier via email.
        </p>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E8E2D8] space-y-4 shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8E2D8]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
                    : 'bg-[#F2ECE4] text-[#524B42] hover:bg-[#E8DCCB] hover:text-[#1C1B1A]'
                }`}
              >
                {cat}
                {cat === 'All' && ` (${artworks.length})`}
              </button>
            );
          })}
        </div>

        {/* Search & Layout Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8275]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, artist, medium..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-[#8C8275]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Summary & View Toggles */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs text-[#665F55]">
            <span>
              Showing <strong className="text-[#1C1B1A] font-semibold">{filteredArtworks.length}</strong> artwork{filteredArtworks.length === 1 ? '' : 's'}
            </span>

            {/* Grid density toggles */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-[#F2ECE4] rounded-lg border border-[#E2DAD0]">
              <button
                onClick={() => setCols(3)}
                className={`p-1.5 rounded-md transition-colors ${
                  cols === 3 ? 'bg-white shadow-xs text-[#1C1B1A]' : 'text-[#8C8275] hover:text-[#1C1B1A]'
                }`}
                title="3 Columns Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCols(4)}
                className={`p-1.5 rounded-md transition-colors ${
                  cols === 4 ? 'bg-white shadow-xs text-[#1C1B1A]' : 'text-[#8C8275] hover:text-[#1C1B1A]'
                }`}
                title="4 Columns Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Gallery Grid Output */}
      {filteredArtworks.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          } gap-8`}
        >
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#F4EFEA] rounded-2xl border border-[#E8E2D8] space-y-4 max-w-xl mx-auto p-8">
          <SlidersHorizontal className="w-10 h-10 text-[#8C8275] mx-auto" />
          <h3 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
            No Artworks Found
          </h3>
          <p className="text-xs text-[#665F55] leading-relaxed">
            No artworks match your current search "{searchQuery}" in category "{selectedCategory}". Try clearing your filters or selecting another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-lg bg-[#1C1B1A] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#33312E] transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
