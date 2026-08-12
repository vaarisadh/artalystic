import React, { useState } from 'react';
import { useArt } from '../context/ArtContext';
import { Mail, Instagram, Send, CheckCircle2, Copy, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';

export const ContactPage: React.FC = () => {
  const { showToast, submitEmailRequest } = useArt();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create document in contactEnquiries Firestore collection
      await addDoc(collection(db, 'contactEnquiries'), {
        name: name.trim(),
        email: email.trim(),
        inquiryTopic: subject || 'General Inquiry',
        message: message.trim(),
        createdAt: serverTimestamp()
      });

      // Record inquiry in system log for admin preview
      await submitEmailRequest(
        'contact-form',
        `Contact Form: ${subject}`,
        'Artalystic Gallery',
        name.trim(),
        email.trim(),
        `Subject: ${subject}\n\nMessage: ${message}`
      );

      setIsSent(true);
      showToast('Thank you for reaching out! Your message has been received.', 'success');
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
    } catch (err: any) {
      console.error('Contact Form Submission Error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'contactEnquiries');
      const errorMsg = err.message || 'Failed to submit message. Please try again.';
      setSubmitError(errorMsg);
      showToast('Failed to submit message to Firebase.', 'error');
      // Do NOT set isSent(true) on error!
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B1A] tracking-tight">
          Contact Us
        </h1>
        <p className="text-base sm:text-lg text-[#524B42] leading-relaxed">
          We would love to hear from you. Whether you have questions about custom artwork inquiries, artist collaborations, or exhibition details, feel free to reach out to us directly.
        </p>
      </div>

      {/* Main Grid: Direct Contact Cards + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Social & Email Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Instagram Card */}
          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E2D8] space-y-4 shadow-sm hover:border-[#D1C7B7] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5E3C]">Social Media</span>
                <h3 className="font-serif text-xl font-bold text-[#1C1B1A]">Instagram</h3>
                <p className="text-xs text-[#8C8275]">Follow our daily exhibitions & updates</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D8] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#8C8275]">Handle</p>
                <p className="text-base font-bold text-[#1C1B1A] truncate font-mono">@vaariartspace</p>
              </div>
              <button
                onClick={() => handleCopy('@vaariartspace', 'Instagram handle')}
                className="p-2 rounded-xl text-[#8C8275] hover:text-[#1C1B1A] hover:bg-[#F2ECE4] transition-colors cursor-pointer shrink-0"
                title="Copy Instagram Handle"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <a
              href="https://www.instagram.com/vaariartspace"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-rose-400" />
              <span>Visit @vaariartspace on Instagram</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E2D8] space-y-4 shadow-sm hover:border-[#D1C7B7] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1B1A] text-[#FAF8F5] flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-6 h-6 text-[#C18C5D]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5E3C]">Direct Email</span>
                <h3 className="font-serif text-xl font-bold text-[#1C1B1A]">Official Gallery Email</h3>
                <p className="text-xs text-[#8C8275]">Inquiries, pricing & curatorial details</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D8] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#8C8275]">Email Address</p>
                <p className="text-sm sm:text-base font-bold text-[#1C1B1A] truncate font-mono">vaariartspace@gmail.com</p>
              </div>
              <button
                onClick={() => handleCopy('vaariartspace@gmail.com', 'Email address')}
                className="p-2 rounded-xl text-[#8C8275] hover:text-[#1C1B1A] hover:bg-[#F2ECE4] transition-colors cursor-pointer shrink-0"
                title="Copy Email Address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <a
              href="mailto:vaariartspace@gmail.com?subject=Inquiry%20from%20Artalystic%20Visitor"
              className="w-full py-3 px-4 rounded-2xl bg-[#8B5E3C] hover:bg-[#734c2e] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send Direct Email</span>
            </a>
          </div>

        </div>

        {/* Right Column: Interactive Send Message Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E2D8] space-y-6 shadow-sm">
            <div className="border-b border-[#E8E2D8] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#1C1B1A] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#8B5E3C]" />
                <span>Send Us a Direct Message</span>
              </h2>
            </div>

            {isSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-emerald-900">Message Delivered!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Thank you for contacting Artalystic Gallery. We have recorded your message and our team will get back to you at your provided email shortly.
                  </p>
                </div>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Submission Failed</p>
                      <p className="mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCD3C7] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] outline-none text-xs text-[#1C1B1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                      Your Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCD3C7] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] outline-none text-xs text-[#1C1B1A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCD3C7] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] outline-none text-xs text-[#1C1B1A]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Artwork Purchase & Pricing">Artwork Purchase & Pricing</option>
                    <option value="Commission Request">Commission Request</option>
                    <option value="Artist Collaboration">Artist Collaboration</option>
                    <option value="Exhibition Details">Exhibition Details</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B1A] mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your query or message here..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCD3C7] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] outline-none text-xs text-[#1C1B1A] resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#C18C5D]" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
