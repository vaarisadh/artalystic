import React, { useState, useEffect } from 'react';
import { useArt } from '../context/ArtContext';
import { Category, Artwork } from '../types';
import {
  Plus,
  Trash2,
  Star,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle,
  Mail,
  UserCheck,
  Layers,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Key,
  LogOut,
  KeyRound,
  ShieldAlert,
  Check,
  User,
  Globe,
  Sparkles,
  UploadCloud,
  X,
  Copy,
  Send,
  FileText,
  ExternalLink,
  MessageSquare,
  Edit,
  Database
} from 'lucide-react';
import {
  subscribeToAuth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  testFirestoreConnection,
  firebaseConfig
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export const AdminPage: React.FC = () => {
  const {
    artworks,
    emailRequests,
    applications,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    toggleFeatured,
    toggleAvailability,
    updateApplicationStatus,
    deleteEmailRequest,
    deleteApplication,
    showToast,
    setSelectedArtwork
  } = useArt();

  // Firebase Auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('artalystic_owner_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('artalystic_owner_auth', 'true');
      }
    });

    testFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  // Credentials & Auth state
  const [storedUsername, setStoredUsername] = useState<string>(() => {
    return localStorage.getItem('artalystic_owner_username') || 'owner';
  });
  const [storedPassword, setStoredPassword] = useState<string>(() => {
    return localStorage.getItem('artalystic_owner_password') || 'artalystic2026';
  });

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteAppConfirmId, setDeleteAppConfirmId] = useState<string | null>(null);
  const [deleteArtConfirmId, setDeleteArtConfirmId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'applications' | 'emails' | 'contact'>('add');

  // New Artwork Form State
  const [artworkCode, setArtworkCode] = useState(() => `ART-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [artistEmail, setArtistEmail] = useState('');
  const [category, setCategory] = useState<Category>('Traditional Art');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Artwork Modal State
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtworkCode, setEditArtworkCode] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editArtistEmail, setEditArtistEmail] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('Traditional Art');
  const [editMedium, setEditMedium] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editYear, setEditYear] = useState('2026');
  const [editDescription, setEditDescription] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editUploadFileName, setEditUploadFileName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Desktop File Upload State
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSize, setUploadFileSize] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const editFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please select a valid image (JPG, PNG, WEBP) or PDF file.');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadFileName(file.name);
    setUploadFileSize(`${sizeMB} MB`);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please select a valid image (JPG, PNG, WEBP) or PDF file.');
      return;
    }

    setEditUploadFileName(file.name);
    setEditFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
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
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please select a valid image (JPG, PNG, WEBP) or PDF file.');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadFileName(file.name);
    setUploadFileSize(`${sizeMB} MB`);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
    }
  };

  const clearUploadedImage = () => {
    setImageUrl('');
    setSelectedFile(null);
    setUploadFileName('');
    setUploadFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Login via Email/Username and Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthLoading(true);

    const enteredUser = usernameInput.trim();
    if (!enteredUser || !passwordInput) {
      setLoginError('Please enter both username/email and password.');
      setAuthLoading(false);
      return;
    }

    // 1. Check custom configured owner username or fallback defaults ('admin' / 'owner')
    const isMatchingUsername =
      enteredUser.toLowerCase() === storedUsername.toLowerCase() ||
      enteredUser.toLowerCase() === 'admin' ||
      enteredUser.toLowerCase() === 'owner';

    if (isMatchingUsername && passwordInput === storedPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('artalystic_owner_auth', 'true');
      setUsernameInput('');
      setPasswordInput('');
      setAuthLoading(false);
      return;
    }

    // 2. Attempt Firebase Email Login/SignUp if input is an email address
    if (enteredUser.includes('@')) {
      if (isSignUpMode) {
        const { user, error } = await signUpWithEmail(enteredUser, passwordInput);
        if (user) {
          setIsAuthenticated(true);
          localStorage.setItem('artalystic_owner_auth', 'true');
          setUsernameInput('');
          setPasswordInput('');
          setAuthLoading(false);
          return;
        } else if (error) {
          setLoginError(error);
          setAuthLoading(false);
          return;
        }
      } else {
        const { user, error } = await signInWithEmail(enteredUser, passwordInput);
        if (user) {
          setIsAuthenticated(true);
          localStorage.setItem('artalystic_owner_auth', 'true');
          setUsernameInput('');
          setPasswordInput('');
          setAuthLoading(false);
          return;
        }
      }
    }

    setLoginError('Invalid username or password.');
    setAuthLoading(false);
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setLoginError('');
    setAuthLoading(true);
    const { user, error } = await signInWithGoogle();
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem('artalystic_owner_auth', 'true');
    } else if (error) {
      setLoginError(error);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsAuthenticated(false);
    localStorage.removeItem('artalystic_owner_auth');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (oldPasswordInput !== storedPassword) {
      setPasswordChangeError('Current password is incorrect.');
      return;
    }

    let updatedUser = storedUsername;
    if (newUsernameInput.trim()) {
      updatedUser = newUsernameInput.trim();
    }

    let updatedPass = storedPassword;
    if (newPasswordInput) {
      if (newPasswordInput.length < 6) {
        setPasswordChangeError('New password must be at least 6 characters long.');
        return;
      }
      if (newPasswordInput !== confirmNewPasswordInput) {
        setPasswordChangeError('New passwords do not match.');
        return;
      }
      updatedPass = newPasswordInput;
    }

    setStoredUsername(updatedUser);
    setStoredPassword(updatedPass);
    localStorage.setItem('artalystic_owner_username', updatedUser);
    localStorage.setItem('artalystic_owner_password', updatedPass);

    setPasswordChangeSuccess('Owner credentials updated successfully!');
    setOldPasswordInput('');
    setNewUsernameInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');

    setTimeout(() => {
      setShowChangePasswordModal(false);
      setPasswordChangeSuccess('');
    }, 1800);
  };

  // Preset sample image generator helper for easy testing
  const sampleImages: Record<Category, string[]> = {
    'Traditional Art': [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop'
    ],
    'Fan Art': [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop'
    ],
    'Digital Art': [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop'
    ],
    'Handmade Art': [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop'
    ]
  };

  const fillSampleImage = () => {
    const arr = sampleImages[category] || sampleImages['Traditional Art'];
    const randomImg = arr[Math.floor(Math.random() * arr.length)];
    setImageUrl(randomImg);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) {
      showToast('Please provide artwork title and artist name.', 'error');
      return;
    }
    if (!imageUrl && !selectedFile) {
      showToast('Please select an artwork file (image/pdf) or provide a URL.', 'error');
      return;
    }

    setIsSubmitting(true);

    const success = await addArtwork(
      {
        artworkCode: artworkCode || `ART-${Math.floor(100 + Math.random() * 900)}`,
        title,
        artist,
        artistName: artist,
        artistEmail,
        category,
        medium: medium || 'Mixed Media',
        dimensions: dimensions || 'Standard',
        year: year || '2026',
        imageUrl,
        description: description || 'Original curated artwork featured on Artalystic.',
        artistNote: story,
        story,
        available,
        featured
      },
      selectedFile || undefined
    );

    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setArtist('');
      setArtistEmail('');
      setMedium('');
      setDimensions('');
      setImageUrl('');
      setSelectedFile(null);
      setUploadFileName('');
      setUploadFileSize('');
      setDescription('');
      setStory('');
      setFeatured(false);
      setAvailable(true);
      setArtworkCode(`ART-${Math.floor(100 + Math.random() * 900)}`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartEdit = (art: Artwork) => {
    setEditingArtwork(art);
    setEditTitle(art.title);
    setEditArtworkCode(art.artworkCode || `ART-${Math.floor(100 + Math.random() * 900)}`);
    setEditArtist(art.artist || art.artistName || '');
    setEditArtistEmail(art.artistEmail || '');
    setEditCategory(art.category || 'Traditional Art');
    setEditMedium(art.medium || 'Mixed Media');
    setEditDimensions(art.dimensions || 'Standard');
    setEditYear(String(art.year || '2026'));
    setEditDescription(art.description || '');
    setEditStory(art.artistNote || art.story || '');
    setEditImageUrl(art.imageUrl || '');
    setEditAvailable(art.available !== undefined ? art.available : true);
    setEditFeatured(art.featured || false);
    setEditFile(null);
    setEditUploadFileName('');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork) return;
    if (!editTitle || !editArtist) {
      showToast('Title and artist name are required.', 'error');
      return;
    }

    setIsUpdating(true);
    const success = await updateArtwork(
      editingArtwork.id,
      {
        artworkCode: editArtworkCode,
        title: editTitle,
        artist: editArtist,
        artistName: editArtist,
        artistEmail: editArtistEmail,
        category: editCategory,
        medium: editMedium,
        dimensions: editDimensions,
        year: editYear,
        description: editDescription,
        artistNote: editStory,
        story: editStory,
        imageUrl: editImageUrl,
        available: editAvailable,
        featured: editFeatured
      },
      editFile || undefined
    );

    setIsUpdating(false);
    if (success) {
      setEditingArtwork(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 px-4 py-8 animate-in fade-in duration-300">
        <div className="bg-[#1C1B1A] text-[#FAF8F5] p-8 rounded-3xl border border-[#33312E] shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Decorative Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C18C5D] via-[#E8DCCB] to-[#C18C5D]" />

          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#2A2825] border border-[#3D3A36] flex items-center justify-center text-[#C18C5D] shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[#C18C5D] text-[11px] uppercase tracking-widest font-semibold pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Portal Security</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#FAF8F5]">
              Owner Portal Sign In
            </h2>
            <p className="text-xs text-[#A39B8E] font-light">
              Sign in with your admin credentials or Google account to access the control panel.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="bg-red-950/80 border border-red-800/80 p-3 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#BFB7AB] mb-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8275]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#2A2825] border border-[#3D3A36] text-xs text-[#FAF8F5] placeholder-[#665F55] focus:outline-none focus:border-[#e7e2d7] focus:ring-1 focus:ring-[#e7e2d7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#BFB7AB] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8275]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#2A2825] border border-[#3D3A36] text-xs text-[#FAF8F5] placeholder-[#665F55] focus:outline-none focus:border-[#e7e2d7] focus:ring-1 focus:ring-[#e7e2d7] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C8275] hover:text-[#FAF8F5] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[#e7e2d7] hover:bg-[#d8d3c8] text-[#1C1B1A] text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{authLoading ? 'Authenticating...' : 'Unlock Owner Portal'}</span>
            </button>


          </form>

        </div>
      </div>
    );
  }

  const handleSendAcceptanceEmail = (app: any) => {
    const subject = encodeURIComponent(`Artalystic Gallery Application Approved — Welcome ${app.artistName}!`);
    const body = encodeURIComponent(
      `Hello ${app.artistName},\n\n` +
      `We are thrilled to inform you that your artist collaboration application for Artalystic Gallery has been APPROVED!\n\n` +
      `We reviewed your portfolio (${app.portfolioUrl}) and would love to feature your artwork in our gallery collection.\n\n` +
      `Next Steps:\n` +
      `1. Please reply to this email with high-resolution images of the artwork(s) you wish to exhibit.\n` +
      `2. Include titles, dimensions, year created, story/description, and pricing (if applicable).\n\n` +
      `Welcome to the Artalystic family!\n\n` +
      `Warm regards,\n` +
      `Artalystic Gallery Owner\n` +
      `vaariartspace@gmail.com`
    );
    window.location.href = `mailto:${app.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyAcceptanceEmail = (app: any) => {
    const text =
      `Hello ${app.artistName},\n\n` +
      `We are thrilled to inform you that your artist collaboration application for Artalystic Gallery has been APPROVED!\n\n` +
      `We reviewed your portfolio (${app.portfolioUrl}) and would love to feature your artwork in our gallery collection.\n\n` +
      `Next Steps:\n` +
      `1. Please reply to this email with high-resolution images of the artwork(s) you wish to exhibit.\n` +
      `2. Include titles, dimensions, year created, story/description, and pricing (if applicable).\n\n` +
      `Welcome to the Artalystic family!\n\n` +
      `Warm regards,\n` +
      `Artalystic Gallery Owner\n` +
      `vaariartspace@gmail.com`;
    navigator.clipboard.writeText(text);
    showToast(`Acceptance email text copied for ${app.artistName}!`, 'info');
  };

  const artworkDetailRequests = emailRequests.filter((req) => req.artworkId !== 'contact-form');
  const contactMessages = emailRequests.filter((req) => req.artworkId === 'contact-form');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Admin Title Banner */}
      <div className="bg-[#1C1B1A] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#33312E] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#e7e2d7] text-xs uppercase font-semibold tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Website Owner Control Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
            Artalystic Admin Panel
          </h1>
          <p className="text-xs text-[#BFB7AB] font-light mt-1">
            Add new art pieces, manage gallery, review applications, track detail requests, and read direct Contact Us messages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#2A2825] px-3 py-2 rounded-xl border border-[#3D3A36] text-xs">
            <User className="w-3.5 h-3.5 text-[#C18C5D]" />
            <span className="text-[#A39B8E]">Owner:</span>
            <span className="font-semibold text-white">
              {firebaseUser ? firebaseUser.email : storedUsername}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 text-xs font-medium transition-all"
            title="Log out from portal"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E2D8]">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'add'
              ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
              : 'bg-[#F2ECE4] text-[#524B42] hover:bg-[#E8DCCB] hover:text-[#1C1B1A]'
          }`}
        >
          <Plus className="w-4 h-4 text-[#e7e2d7]" />
          <span>Add New Artwork</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'manage'
              ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
              : 'bg-[#F2ECE4] text-[#524B42] hover:bg-[#E8DCCB] hover:text-[#1C1B1A]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Gallery ({artworks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'applications'
              ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
              : 'bg-[#F2ECE4] text-[#524B42] hover:bg-[#E8DCCB] hover:text-[#1C1B1A]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Artist Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'emails'
              ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
              : 'bg-[#F2ECE4] text-[#524B42] hover:bg-[#E8DCCB] hover:text-[#1C1B1A]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Artwork Detail Requests ({artworkDetailRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'contact'
              ? 'bg-[#1C1B1A] text-[#FAF8F5] shadow-sm'
              : 'bg-[#F2ECE4] text-[#524B42] hover:bg-[#E8DCCB] hover:text-[#1C1B1A]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#C18C5D]" />
          <span>Contact Us Messages ({contactMessages.length})</span>
        </button>
      </div>

      {/* TAB 1: ADD NEW ARTWORK FORM */}
      {activeTab === 'add' && (
        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E8E2D8] shadow-sm">
          <form onSubmit={handleAddSubmit} className="space-y-6 max-w-4xl">
            <div className="border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
                Publish New Artwork to Portal
              </h3>
              <p className="text-xs text-[#8C8275] mt-0.5">
                Upload or link artwork images across Traditional, Fan Art, Digital Art, or Handmade categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Artwork Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Celestial Horizon No. 2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#524B42] mb-1">
                      Artist Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524B42] mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    >
                      <option value="Traditional Art">Traditional Art</option>
                      <option value="Fan Art">Fan Art</option>
                      <option value="Digital Art">Digital Art</option>
                      <option value="Handmade Art">Handmade Art</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#524B42] mb-1">
                      Medium
                    </label>
                    <input
                      type="text"
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      placeholder="e.g. Oil on Canvas"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524B42] mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 24x36 inches"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#524B42] mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2026"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#1C1B1A]">
                      Artwork Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageInputMode(imageInputMode === 'file' ? 'url' : 'file')}
                        className="text-[11px] text-[#8B5E3C] hover:underline font-medium"
                      >
                        {imageInputMode === 'file' ? 'Or enter Image URL' : 'Upload from Desktop'}
                      </button>
                      {imageInputMode === 'url' && (
                        <button
                          type="button"
                          onClick={fillSampleImage}
                          className="text-[11px] text-[#8B5E3C] hover:underline flex items-center gap-1 font-medium"
                        >
                          <RefreshCw className="w-3 h-3" /> Auto-fill Sample
                        </button>
                      )}
                    </div>
                  </div>

                  {imageInputMode === 'file' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="desktop-image-upload"
                      />

                      {!imageUrl ? (
                        <div
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#DCD3C7] hover:border-[#8B5E3C] bg-white hover:bg-[#FAF8F5] rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#F2ECE4] group-hover:bg-[#E8DCCB] text-[#8B5E3C] flex items-center justify-center mx-auto transition-colors">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#1C1B1A]">
                              Click to select image file from desktop
                            </p>
                            <p className="text-[11px] text-[#8C8275] mt-0.5">
                              or drag & drop file here (PNG, JPG, WEBP, GIF)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-2xl border border-[#DCD3C7] flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={imageUrl}
                              alt="Uploaded desktop file"
                              className="w-14 h-14 object-cover rounded-xl border border-[#E0D7CC] shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-md mb-0.5">
                                Desktop File Uploaded ✓
                              </span>
                              <p className="text-xs font-semibold text-[#1C1B1A] truncate">
                                {uploadFileName || 'Uploaded Desktop File'}
                              </p>
                              {uploadFileSize && (
                                <p className="text-[10px] text-[#8C8275]">{uploadFileSize}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={clearUploadedImage}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-xs font-medium flex items-center gap-1 shrink-0"
                            title="Remove uploaded image"
                          >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Change File</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/your-artwork-image.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                    />
                  )}
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Artwork Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the artwork theme, visual aesthetics, color palette..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#524B42] mb-1">
                    Artist Story / Creator's Note <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Behind-the-scenes story, inspiration, or technique details..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                  />
                </div>

                {/* Live Image Preview Card */}
                {imageUrl && (
                  <div className="p-3 bg-[#F2ECE4] rounded-xl border border-[#E2DAD0] flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-[#DCD3C7]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-[#1C1B1A] block">Image Preview Loaded</span>
                      <span className="text-[10px] text-[#8C8275]">Ready to publish to portal</span>
                    </div>
                  </div>
                )}

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5E3C] focus:ring-[#8B5E3C]"
                  />
                  <label htmlFor="featuredToggle" className="text-xs font-medium text-[#1C1B1A] cursor-pointer">
                    Feature on Homepage Showcase Spotlight
                  </label>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#E8E2D8] flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-[#FAF8F5] text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#e7e2d7]" />
                    <span>Publishing to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#e7e2d7]" />
                    <span>Publish Artwork to Portal</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: MANAGE GALLERY */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#8B5E3C]" />
              <span className="text-xs font-semibold text-[#1C1B1A]">
                Live Firestore Collection ({artworks.length} items)
              </span>
            </div>
            <span className="text-[11px] text-[#665F55] bg-[#EAE2D8] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-time Firestore Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] p-4 flex flex-col justify-between space-y-3 relative shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-20 h-20 object-cover rounded-xl border border-[#E0D7CC]"
                      referrerPolicy="no-referrer"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border text-white ${
                        art.available !== false
                          ? 'bg-emerald-600 border-emerald-700'
                          : 'bg-rose-600 border-rose-700'
                      }`}
                    >
                      {art.available !== false ? 'Available' : 'Sold'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#8B5E3C] bg-[#F2ECE4] px-1.5 py-0.5 rounded">
                        {art.artworkCode || `ART-${art.id.substring(0, 4)}`}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#8C8275]">
                        {art.category}
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-semibold text-[#1C1B1A] truncate">
                      {art.title}
                    </h4>
                    <p className="text-xs text-[#665F55] truncate">
                      by {art.artist || art.artistName || 'Artist'}
                    </p>
                    <p className="text-[11px] text-[#8C8275] truncate mt-0.5">
                      {art.medium} • {art.year}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleFeatured(art.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-[11px] font-medium ${
                        art.featured
                          ? 'bg-[#1C1B1A] text-[#E8DCCB]'
                          : 'bg-[#F2ECE4] text-[#665F55] hover:bg-[#E2DAD0]'
                      }`}
                      title="Toggle homepage spotlight"
                    >
                      <Star className={`w-3.5 h-3.5 ${art.featured ? 'fill-[#e7e2d7] text-[#e7e2d7]' : ''}`} />
                      <span>{art.featured ? 'Featured' : 'Spotlight'}</span>
                    </button>

                    <button
                      onClick={() => toggleAvailability(art.id)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        art.available !== false
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                      title="Toggle availability status"
                    >
                      {art.available !== false ? 'Mark Sold' : 'Mark Available'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(art)}
                      className="p-1.5 rounded-lg text-[#8B5E3C] hover:bg-[#F2ECE4] transition-colors"
                      title="Edit artwork details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedArtwork(art)}
                      className="p-1.5 rounded-lg text-[#8C8275] hover:text-[#1C1B1A] hover:bg-[#F2ECE4]"
                      title="Preview piece"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {deleteArtConfirmId === art.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteArtwork(art.id);
                            setDeleteArtConfirmId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" /> Confirm
                        </button>
                        <button
                          onClick={() => setDeleteArtConfirmId(null)}
                          className="px-1.5 py-1 rounded-lg bg-gray-200 text-gray-700 text-[11px] transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteArtConfirmId(art.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete artwork"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REVIEW ARTIST APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E2D8] space-y-4">
          <div className="border-b border-[#E8E2D8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
                Artist Collaboration Applications
              </h3>
              <p className="text-xs text-[#8C8275]">
                Review submissions and notify accepted artists directly at their email address.
              </p>
            </div>
            <div className="text-xs text-[#8B5E3C] bg-[#F2ECE4] px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Email Notification Enabled</span>
            </div>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-white rounded-2xl border border-[#E8E2D8] space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE4] pb-2">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#1C1B1A]">
                        {app.artistName}
                      </h4>
                      <p className="text-xs text-[#8B5E3C]">
                        {app.email} • Category: <strong>{app.primaryCategory}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#F2ECE4] text-[#524B42]">
                        Status: {app.status}
                      </span>
                      <button
                        onClick={() => {
                          const newStatus = app.status === 'Approved' ? 'Pending' : 'Approved';
                          updateApplicationStatus(app.id, newStatus);
                          if (newStatus === 'Approved') {
                            handleSendAcceptanceEmail(app);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-[#1C1B1A] text-[#FAF8F5] hover:bg-[#33312E]'
                        }`}
                      >
                        {app.status === 'Approved' ? 'Approved ✓' : 'Approve & Notify Artist'}
                      </button>
                      {deleteAppConfirmId === app.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteApplication(app.id);
                              setDeleteAppConfirmId(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Confirm</span>
                          </button>
                          <button
                            onClick={() => setDeleteAppConfirmId(null)}
                            className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteAppConfirmId(app.id)}
                          className="px-2 py-1 rounded-lg text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all flex items-center gap-1 cursor-pointer"
                          title="Delete application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#665F55] italic font-serif">
                    "{app.bio}"
                  </p>

                  {/* Sample Artwork / PDF Attachment */}
                  {app.artSampleUrl && (
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {app.artSampleUrl.startsWith('data:application/pdf') || app.artSampleUrl.includes('.pdf') ? (
                          <div className="w-10 h-10 bg-red-100 text-red-700 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        ) : (
                          <img
                            src={app.artSampleUrl}
                            alt="Sample Artwork"
                            className="w-10 h-10 object-cover rounded-lg border border-[#E0D7CC] shrink-0"
                          />
                        )}
                        <div className="min-w-0 text-xs">
                          <p className="font-semibold text-[#1C1B1A] truncate">
                            {app.artSampleUrl.startsWith('data:application/pdf') || app.artSampleUrl.includes('.pdf')
                              ? 'Sample Artwork Portfolio (PDF)'
                              : 'Sample Artwork Image'}
                          </p>
                          <span className="text-[10px] text-[#8C8275]">Attached by {app.artistName}</span>
                        </div>
                      </div>

                      <a
                        href={app.artSampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-[#F2ECE4] border border-[#E8E2D8] text-[#1C1B1A] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                      >
                        <span>{app.artSampleUrl.startsWith('data:application/pdf') || app.artSampleUrl.includes('.pdf') ? 'Open PDF' : 'View Image'}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#8C8275]" />
                      </a>
                    </div>
                  )}

                  <div className="text-[11px] text-[#8C8275] flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F2ECE4]">
                    <div>Portfolio: <a href={app.portfolioUrl.startsWith('http') ? app.portfolioUrl : `https://${app.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#8B5E3C] underline hover:text-[#524B42]">{app.portfolioUrl}</a></div>
                    <div>Applied: {new Date(app.timestamp).toLocaleDateString()}</div>
                  </div>

                  {/* Email Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2D8]">
                    <span className="text-[11px] text-[#665F55] font-medium mr-auto">
                      Notification Tools for <strong>{app.artistName}</strong>:
                    </span>
                    <button
                      onClick={() => handleSendAcceptanceEmail(app)}
                      className="px-3 py-1.5 rounded-lg bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      title={`Send email to ${app.email}`}
                    >
                      <Send className="w-3.5 h-3.5 text-[#C18C5D]" />
                      <span>Send Acceptance Email</span>
                    </button>
                    <button
                      onClick={() => handleCopyAcceptanceEmail(app)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2ECE4] border border-[#E8E2D8] text-[#1C1B1A] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Copy email template to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#8C8275]" />
                      <span>Copy Email Text</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8C8275] py-8 text-center">
              No artist collaboration applications received yet.
            </p>
          )}
        </div>
      )}

      {/* TAB 4: EMAIL DETAIL REQUESTS LOG */}
      {activeTab === 'emails' && (
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E2D8] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D8] pb-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
                Artwork Detail Requests
              </h3>
              <p className="text-xs text-[#8C8275]">
                Review visitor requests, selected artwork images, and custom messages from artwork detail modals.
              </p>
            </div>
            {artworkDetailRequests.length > 0 && (
              <span className="text-xs text-[#8B5E3C] bg-[#F2ECE4] px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                {artworkDetailRequests.length} Total Request{artworkDetailRequests.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {artworkDetailRequests.length > 0 ? (
            <div className="space-y-4">
              {artworkDetailRequests.map((req) => {
                const linkedArt = artworks.find((a) => a.id === req.artworkId);
                const displayImage = req.artworkImageUrl || linkedArt?.imageUrl;

                return (
                  <div
                    key={req.id}
                    className="p-5 bg-white rounded-2xl border border-[#E8E2D8] space-y-4 hover:border-[#D1C7B7] transition-all shadow-xs"
                  >
                    {/* Header Row: Requester Info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE4]">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5E3C] block mb-0.5">
                          Visitor Detail Inquiry
                        </span>
                        <h4 className="font-semibold text-base text-[#1C1B1A] flex flex-wrap items-center gap-2">
                          <User className="w-4 h-4 text-[#8C8275]" />
                          <span>{req.requesterName}</span>
                          <span className="text-xs font-normal text-[#8C8275] font-mono">(&lt;{req.requesterEmail}&gt;)</span>
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase">
                          <CheckCircle className="w-3 h-3" /> Sent to Inbox
                        </span>
                        <span className="text-[11px] text-[#8C8275] ml-1">
                          {new Date(req.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Middle Section: Selected Artwork & Visitor Message Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      
                      {/* Selected Artwork Box (5 Cols) */}
                      <div className="md:col-span-5 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E2D8] space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block">
                          Selected Artwork by Visitor:
                        </span>
                        <div className="flex items-center gap-3">
                          {displayImage ? (
                            <div className="relative group shrink-0">
                              <img
                                src={displayImage}
                                alt={req.artworkTitle}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E0D7CC] shadow-xs cursor-pointer group-hover:opacity-90 transition-opacity"
                                onClick={() => linkedArt && setSelectedArtwork(linkedArt)}
                                referrerPolicy="no-referrer"
                              />
                              {linkedArt && (
                                <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                  <ExternalLink className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-[#F2ECE4] rounded-xl flex items-center justify-center text-[#8C8275] shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h5 className="font-serif text-sm font-bold text-[#1C1B1A] truncate">
                              {req.artworkTitle}
                            </h5>
                            <p className="text-xs text-[#665F55]">by {req.artworkArtist}</p>
                            {linkedArt && (
                              <p className="text-[11px] text-[#8C8275] mt-0.5 truncate">
                                {linkedArt.category} • {linkedArt.medium}
                              </p>
                            )}
                            {linkedArt && (
                              <button
                                onClick={() => setSelectedArtwork(linkedArt)}
                                className="text-[11px] text-[#8B5E3C] font-semibold hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                              >
                                <span>Inspect Artwork</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Visitor Custom Message Box (7 Cols) */}
                      <div className="md:col-span-7 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E2D8] space-y-1.5 h-full flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5E3C] flex items-center gap-1.5 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-[#8B5E3C]" />
                            <span>Visitor Message / Request:</span>
                          </span>
                          <p className="text-xs sm:text-sm text-[#1C1B1A] font-serif leading-relaxed italic bg-white p-3 rounded-lg border border-[#E8E2D8]">
                            "{req.message || 'No custom message provided.'}"
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Footer Actions Row */}
                    <div className="pt-2 border-t border-[#F2ECE4] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${req.requesterEmail}?subject=${encodeURIComponent(`Artalystic Gallery — Re: Your inquiry regarding "${req.artworkTitle}"`)}`}
                          className="px-3 py-1.5 rounded-lg bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-[#C18C5D]" />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(req.requesterEmail);
                            showToast(`Copied email: ${req.requesterEmail}`, 'info');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2ECE4] border border-[#E8E2D8] text-[#1C1B1A] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#8C8275]" />
                          <span>Copy Email</span>
                        </button>
                      </div>

                      {deleteConfirmId === req.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              deleteEmailRequest(req.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Confirm Delete</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(req.id)}
                          className="px-2.5 py-1.5 rounded-xl text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                          title="Delete request entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Delete</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#8C8275] py-8 text-center">
              No artwork detail requests logged yet.
            </p>
          )}
        </div>
      )}

      {/* TAB 5: CONTACT US DIRECT MESSAGES */}
      {activeTab === 'contact' && (
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E2D8] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D8] pb-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1C1B1A]">
                Contact Us — Direct Messages
              </h3>
              <p className="text-xs text-[#8C8275]">
                Messages submitted by visitors via the "Contact Us &gt; Send Us a Direct Message" page.
              </p>
            </div>
            {contactMessages.length > 0 && (
              <span className="text-xs text-[#8B5E3C] bg-[#F2ECE4] px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                {contactMessages.length} Direct Message{contactMessages.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {contactMessages.length > 0 ? (
            <div className="space-y-4">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 bg-white rounded-2xl border border-[#E8E2D8] space-y-4 hover:border-[#D1C7B7] transition-all shadow-xs"
                >
                  {/* Sender Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE4]">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5E3C] block mb-0.5">
                        Direct Inquiry via Contact Page
                      </span>
                      <h4 className="font-semibold text-base text-[#1C1B1A] flex flex-wrap items-center gap-2">
                        <User className="w-4 h-4 text-[#8C8275]" />
                        <span>{msg.requesterName}</span>
                        <span className="text-xs font-normal text-[#8C8275] font-mono">(&lt;{msg.requesterEmail}&gt;)</span>
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold uppercase border border-amber-200/60">
                        <MessageSquare className="w-3 h-3 text-amber-700" /> Direct Message
                      </span>
                      <span className="text-[11px] text-[#8C8275] ml-1">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D8] space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B5E3C] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>Message Body & Details:</span>
                    </span>
                    <div className="bg-white p-3.5 rounded-lg border border-[#E8E2D8] text-xs sm:text-sm text-[#1C1B1A] font-serif leading-relaxed whitespace-pre-wrap">
                      {msg.message || 'No text provided.'}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-[#F2ECE4] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${msg.requesterEmail}?subject=${encodeURIComponent(`Artalystic Gallery — Re: Your Contact Inquiry`)}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C18C5D]" />
                        <span>Reply via Email</span>
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.requesterEmail);
                          showToast(`Copied email: ${msg.requesterEmail}`, 'info');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#F2ECE4] border border-[#E8E2D8] text-[#1C1B1A] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#8C8275]" />
                        <span>Copy Email</span>
                      </button>
                    </div>

                    {deleteConfirmId === msg.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            deleteEmailRequest(msg.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Confirm Delete</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(msg.id)}
                        className="px-2.5 py-1.5 rounded-xl text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                        title="Delete direct message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold">Delete</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8C8275] py-8 text-center">
              No direct Contact Us messages received yet.
            </p>
          )}
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#1C1B1A] text-[#FAF8F5] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-[#33312E] shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-[#33312E] pb-3">
              <div className="flex items-center gap-2 text-[#e7e2d7] text-xs uppercase font-semibold tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Portal Security</span>
              </div>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordChangeError('');
                  setPasswordChangeSuccess('');
                }}
                className="text-[#8C8275] hover:text-[#FAF8F5] text-xs font-semibold px-2 py-1 rounded-lg hover:bg-[#2A2825]"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold">Update Owner Credentials</h3>
              <p className="text-xs text-[#A39B8E] mt-1 font-light">
                Update your username and/or password for the Artalystic Owner Control Portal.
              </p>
            </div>

            {passwordChangeError && (
              <div className="bg-red-950/80 border border-red-800/80 p-3 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                <span>{passwordChangeError}</span>
              </div>
            )}

            {passwordChangeSuccess && (
              <div className="bg-emerald-950/80 border border-emerald-800/80 p-3 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{passwordChangeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#BFB7AB] mb-1">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={oldPasswordInput}
                  onChange={(e) => setOldPasswordInput(e.target.value)}
                  placeholder="Enter current password to authorize changes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A2825] border border-[#3D3A36] text-xs text-[#FAF8F5] focus:outline-none focus:border-[#e7e2d7]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BFB7AB] mb-1">
                  New Owner Username (Optional)
                </label>
                <input
                  type="text"
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  placeholder={`Current username: ${storedUsername}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A2825] border border-[#3D3A36] text-xs text-[#FAF8F5] focus:outline-none focus:border-[#e7e2d7]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BFB7AB] mb-1">
                  New Password (Optional, min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A2825] border border-[#3D3A36] text-xs text-[#FAF8F5] focus:outline-none focus:border-[#e7e2d7]"
                />
              </div>

              {newPasswordInput && (
                <div>
                  <label className="block text-xs font-medium text-[#BFB7AB] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPasswordInput}
                    onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A2825] border border-[#3D3A36] text-xs text-[#FAF8F5] focus:outline-none focus:border-[#e7e2d7]"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#2A2825] text-[#A39B8E] hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#e7e2d7] hover:bg-[#d8d3c8] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* EDIT ARTWORK MODAL */}
      {editingArtwork && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E2D8] max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setEditingArtwork(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EAE2D8] text-[#665F55] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E8E2D8]">
              <Edit className="w-5 h-5 text-[#8B5E3C]" />
              <h3 className="font-serif text-xl font-bold text-[#1C1B1A]">
                Edit Firestore Artwork Record
              </h3>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Artwork Code
                  </label>
                  <input
                    type="text"
                    value={editArtworkCode}
                    onChange={(e) => setEditArtworkCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs font-mono text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Artwork Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editArtist}
                    onChange={(e) => setEditArtist(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                  >
                    <option value="Traditional Art">Traditional Art</option>
                    <option value="Fan Art">Fan Art</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Handmade Art">Handmade Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={editMedium}
                    onChange={(e) => setEditMedium(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Dimensions / Size
                  </label>
                  <input
                    type="text"
                    value={editDimensions}
                    onChange={(e) => setEditDimensions(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Creation Year
                  </label>
                  <input
                    type="text"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#524B42] mb-1">
                    Replace Artwork File (Optional)
                  </label>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*,.pdf,application/pdf"
                    onChange={handleEditFileSelect}
                    className="w-full text-xs text-[#665F55] file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EAE2D8] file:text-[#1C1B1A] hover:file:bg-[#DCD3C7]"
                  />
                  {editUploadFileName && (
                    <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                      New file attached: {editUploadFileName}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#524B42] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#524B42] mb-1">
                  Artist Note / Story
                </label>
                <textarea
                  rows={2}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCD3C7] text-xs text-[#1C1B1A]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1B1A]">
                  <input
                    type="checkbox"
                    checked={editAvailable}
                    onChange={(e) => setEditAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5E3C]"
                  />
                  Available for Inquiries
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1C1B1A]">
                  <input
                    type="checkbox"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B5E3C]"
                  />
                  Feature on Homepage Spotlight
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E2D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#DCD3C7] text-xs font-semibold text-[#665F55] hover:bg-[#EAE2D8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#1C1B1A] hover:bg-[#33312E] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#e7e2d7]" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#e7e2d7]" />
                      <span>Save Changes to Firestore</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
