import React, { useState, useRef } from 'react';
import { useArt } from '../context/ArtContext';
import { Category } from '../types';
import { Send, CheckCircle2, Sparkles, Upload, Globe, User, Mail, Brush, UploadCloud, X, FileText, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { db, storage, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const CommunityPage: React.FC = () => {
  const { submitArtistApplication, showToast } = useArt();

  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState<Category>('Traditional Art');
  const [bio, setBio] = useState('');
  const [artSampleUrl, setArtSampleUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSize, setUploadFileSize] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    const isFilePdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isFileImage = file.type.startsWith('image/');
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!isFilePdf && (!isFileImage || (file.type && !allowedImageTypes.includes(file.type.toLowerCase())))) {
      setErrorMessage('Invalid file type. Please select a valid PDF, PNG, JPG, or WEBP file.');
      return;
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(`File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller file.`);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadFileName(file.name);
    setUploadFileSize(`${sizeMB} MB`);
    setIsPdf(isFilePdf);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setArtSampleUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearUploadedImage = () => {
    setArtSampleUrl('');
    setSelectedFile(null);
    setUploadFileName('');
    setUploadFileSize('');
    setIsPdf(false);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !email.trim() || !bio.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!selectedFile && !artSampleUrl) {
      setErrorMessage('Please upload a sample artwork portfolio (PDF or Image).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setUploadProgress(0);

    try {
      let portfolioFileUrl = artSampleUrl || '';

      // Upload file to Firebase Storage if selected
      if (selectedFile) {
        const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const storagePath = `artistApplications/${Date.now()}_${sanitizedName}`;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        portfolioFileUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Firebase Storage Upload Error:', error);
              reject(new Error(`File upload failed: ${error.message}`));
            },
            async () => {
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              } catch (err) {
                reject(err);
              }
            }
          );
        });
      }

      // Create document in artistApplications Firestore collection
      await addDoc(collection(db, 'artistApplications'), {
        name: artistName.trim(),
        email: email.trim(),
        artMedium: primaryCategory,
        portfolioUrl: portfolioUrl.trim() || '',
        portfolioFileUrl: portfolioFileUrl,
        artisticStatement: bio.trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Update local state context for admin preview
      submitArtistApplication({
        artistName: artistName.trim(),
        email: email.trim(),
        portfolioUrl: portfolioUrl.trim() || 'N/A',
        primaryCategory,
        bio: bio.trim(),
        artSampleUrl: portfolioFileUrl
      });

      setIsSubmitted(true);
      showToast('Artist application & portfolio uploaded successfully!', 'success');
    } catch (err: any) {
      console.error('Artist Application Submission Error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'artistApplications');
      const msg = err.message || 'Failed to submit application. Please check your network and try again.';
      setErrorMessage(msg);
      showToast('Application submission failed.', 'error');
      // Do NOT mark as submitted on error!
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleReset = () => {
    setArtistName('');
    setEmail('');
    setPortfolioUrl('');
    setBio('');
    setArtSampleUrl('');
    setUploadFileName('');
    setUploadFileSize('');
    setIsSubmitted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto pt-6 space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B1A]">
          Join Our Creator Community
        </h1>
        <p className="text-sm text-[#665F55] font-light leading-relaxed">
          Are you a traditional painter, fan artist, digital illustrator, or handmade craftsman? Submit your portfolio to collaborate with Artalystic and feature your artworks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Application Form Column */}
        <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E2D8] shadow-sm">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-[#E8E2D8] pb-3 mb-4">
                <h3 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
                  Artist Collaboration Application
                </h3>
                <p className="text-xs text-[#8C8275] mt-1">
                  Tell us about your art style and medium. The portal owner will review your application.
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Submission Error</p>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Artist Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Full Name / Artist Handle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8275]" />
                    <input
                      type="text"
                      required
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8275]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. elena@artspace.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Portfolio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Primary Art Medium <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Brush className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8275]" />
                    <select
                      value={primaryCategory}
                      onChange={(e) => setPrimaryCategory(e.target.value as Category)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    >
                      <option value="Traditional Art">Traditional Art (Oils, Watercolor, Ink)</option>
                      <option value="Fan Art">Fan Art (Anime, Pop Culture Homages)</option>
                      <option value="Digital Art">Digital Art (3D, Painting, Vector)</option>
                      <option value="Handmade Art">Handmade Art (Ceramics, Textiles, Wood)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Portfolio or Instagram URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8275]" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://instagram.com/myart"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>
              </div>

              {/* Sample Artwork PDF / Image Desktop Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1B1A] mb-1.5">
                  Sample Artwork Portfolio (PDF / Image) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf,.pdf,image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="community-image-upload"
                />

                {!artSampleUrl ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#DCD3C7] hover:border-[#8B5E3C] bg-white hover:bg-[#FAF8F5] rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F2ECE4] group-hover:bg-[#E8DCCB] text-[#8B5E3C] flex items-center justify-center mx-auto transition-colors">
                      <FileText className="w-5 h-5 text-[#8B5E3C]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1C1B1A]">
                        Click to select sample artwork PDF document or image
                      </p>
                      <p className="text-[11px] text-[#8C8275] mt-0.5">
                        or drag & drop file here (PDF, PNG, JPG, WEBP)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-2xl border border-[#DCD3C7] flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {isPdf || artSampleUrl.startsWith('data:application/pdf') || uploadFileName.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                          <FileText className="w-7 h-7" />
                        </div>
                      ) : (
                        <img
                          src={artSampleUrl}
                          alt="Uploaded sample artwork"
                          className="w-14 h-14 object-cover rounded-xl border border-[#E0D7CC] shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md mb-0.5 ${
                          isPdf || uploadFileName.toLowerCase().endsWith('.pdf')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isPdf || uploadFileName.toLowerCase().endsWith('.pdf') ? 'PDF Document Attached ✓' : 'Desktop File Attached ✓'}
                        </span>
                        <p className="text-xs font-semibold text-[#1C1B1A] truncate">
                          {uploadFileName || 'Uploaded Sample File'}
                        </p>
                        {uploadFileSize && (
                          <p className="text-[10px] text-[#8C8275]">{uploadFileSize}</p>
                        )}
                        {(isPdf || artSampleUrl.startsWith('data:application/pdf')) && (
                          <a
                            href={artSampleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8B5E3C] hover:underline mt-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Preview PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearUploadedImage}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                      title="Remove uploaded file"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Change File</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bio & Vision */}
              <div>
                <label className="block text-xs font-medium text-[#524B42] mb-1">
                  Artistic Bio & Vision Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary of your creative background, technique, or inspiration..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              {/* Upload Progress Bar */}
              {isSubmitting && (
                <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-[#E8E2D8]">
                  <div className="flex justify-between text-xs font-medium text-[#1C1B1A]">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5E3C]" />
                      Uploading portfolio & submitting application...
                    </span>
                    <span>{uploadProgress !== null ? `${uploadProgress}%` : 'Processing'}</span>
                  </div>
                  <div className="w-full bg-[#E8E2D8] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#8B5E3C] h-2 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress || 10}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] disabled:bg-[#8C8275] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#e7e2d7]" />
                      <span>Submitting to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#e7e2d7]" />
                      <span>Submit Collaboration Application</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Submission Confirmation Card */
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-3xl font-bold text-[#1C1B1A]">
                Application Received!
              </h3>

              <p className="text-xs text-[#665F55] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#1C1B1A]">{artistName}</strong>! Your collaboration application for <strong className="text-[#8B5E3C]">{primaryCategory}</strong> has been logged into the Artalystic Owner Portal.
              </p>

              <div className="p-4 bg-white rounded-xl border border-[#E8E2D8] text-xs text-left max-w-sm mx-auto space-y-1 text-gray-700">
                <p><strong>Artist:</strong> {artistName}</p>
                <p><strong>Contact Email:</strong> {email}</p>
                <p><strong>Category:</strong> {primaryCategory}</p>
                <p><strong>Portfolio:</strong> {portfolioUrl || 'Provided'}</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-[#F2ECE4] hover:bg-[#E2DAD0] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Sidebar Column */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#3a2f26] text-[#FAF8F5] p-8 rounded-3xl border border-[#4d4035] space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#e7e2d7] font-semibold">
              Why Collaborate?
            </span>
            <h3 className="font-serif text-3xl font-light">
              Let Your Work Be Seen
            </h3>
            
            <ul className="space-y-3 text-xs text-[#BFB7AB] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#e7e2d7] shrink-0 mt-0.5" />
                <span><strong>Get Featured:</strong> Your artwork gets a place on Artalystic where people can discover and appreciate it.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#e7e2d7] shrink-0 mt-0.5" />
                <span><strong>Real Interest:</strong> When someone wants to know more about your work, you’ll receive a direct email inquiry.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#e7e2d7] shrink-0 mt-0.5" />
                <span><strong>Your Style, Your Space:</strong> Traditional art, fan art, digital work, handmade pieces — all kinds of creative work are welcome.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#F4EFEA] rounded-2xl border border-[#E8E2D8] space-y-2 text-xs text-[#524B42]">
            <span className="font-semibold text-[#8B5E3C] block uppercase tracking-wider">
              Review Process:
            </span>
            <p className="leading-relaxed font-light">
              Submissions are reviewed within 48 hours. Once approved, artists and their artwork will be featured on the Artalystic website.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
