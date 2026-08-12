import React, { useState } from 'react';
import { useArt } from '../context/ArtContext';
import { Mail, X, CheckCircle, Sparkles, Send, FileText, ArrowRight } from 'lucide-react';

export const EmailDetailModal: React.FC = () => {
  const { emailModalArtwork, setEmailModalArtwork, submitEmailRequest } = useArt();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!emailModalArtwork) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    await submitEmailRequest(
      emailModalArtwork.id,
      emailModalArtwork.title,
      emailModalArtwork.artist,
      name,
      email,
      message,
      emailModalArtwork.imageUrl
    );
    setIsSubmitting(false);
    setIsSent(true);
  };

  const handleClose = () => {
    setEmailModalArtwork(null);
    setIsSent(false);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B1A]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8E2D8] overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F4EFEA] border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8B5E3C]" />
            <h3 className="font-serif text-lg font-semibold text-[#1C1B1A]">
              Get Artwork Details via Email
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-[#8C8275] hover:text-[#1C1B1A] hover:bg-[#E2DAD0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Artwork Summary Strip */}
              <div className="flex items-center gap-4 p-3.5 bg-[#F8F4EF] rounded-xl border border-[#E8E2D8]">
                <img
                  src={emailModalArtwork.imageUrl}
                  alt={emailModalArtwork.title}
                  className="w-16 h-16 object-cover rounded-lg border border-[#E0D7CC] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8B5E3C] font-semibold">
                    {emailModalArtwork.category}
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#1C1B1A] truncate">
                    {emailModalArtwork.title}
                  </h4>
                  <p className="text-xs text-[#665F55]">
                    by {emailModalArtwork.artist} • {emailModalArtwork.medium}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#665F55] leading-relaxed">
                Receive an immediate digital dossier for this artwork directly in your inbox. Includes hi-res details, medium specs, artist background, and collaboration inquiry guidelines.
              </p>

              {/* Input fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Clara Oswald"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C7] text-sm text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Your Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. clara@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C7] text-sm text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Specific Question or Request Note <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Please include physical dimensions or certificate of authenticity info..."
                    className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#DCD3C7] text-sm text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#665F55] hover:bg-[#E8E2D8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3a2f26] hover:bg-[#4d4035] text-[#FAF8F5] text-xs font-medium tracking-wide uppercase transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Dispatching...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#e7e2d7]" />
                      <span>Send Artwork Dossier</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Confirmation View */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
                  Dossier Sent Successfully!
                </h4>
                <p className="text-xs text-[#665F55] mt-1">
                  We have dispatched the complete artwork dossier for{' '}
                  <strong className="text-[#1C1B1A]">"{emailModalArtwork.title}"</strong> to{' '}
                  <span className="text-[#8B5E3C] underline">{email}</span>.
                </p>
              </div>

              {/* Sample Email Preview Sheet Card */}
              <div className="text-left bg-white p-4 rounded-xl border border-[#E8E2D8] shadow-sm text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                  <span className="font-semibold text-[#8B5E3C] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Artalystic Automated Dispatch
                  </span>
                  <span className="text-[10px] text-gray-400">Just Now</span>
                </div>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Piece:</strong> {emailModalArtwork.title}</p>
                  <p><strong>Artist:</strong> {emailModalArtwork.artist}</p>
                  <p><strong>Category:</strong> {emailModalArtwork.category}</p>
                  <p><strong>Medium:</strong> {emailModalArtwork.medium}</p>
                  {emailModalArtwork.dimensions && <p><strong>Dimensions:</strong> {emailModalArtwork.dimensions}</p>}
                  <p><strong>Story & Note:</strong> {emailModalArtwork.description}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-lg bg-[#3a2f26] hover:bg-[#4d4035] text-[#FAF8F5] text-xs font-medium tracking-wider uppercase transition-all"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
