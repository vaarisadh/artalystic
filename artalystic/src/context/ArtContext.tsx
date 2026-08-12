import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork, Category, EmailRequest, ArtistApplication } from '../types';
import { initialArtworks } from '../data/initialArtworks';
import {
  db,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  handleFirestoreError,
  OperationType,
  uploadArtworkFile,
  docToArtwork,
  artworkToDocData
} from '../lib/firebase';
import { uploadArtworkToSupabase } from '../lib/supabase';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ArtContextType {
  artworks: Artwork[];
  emailRequests: EmailRequest[];
  applications: ArtistApplication[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (art: Artwork | null) => void;
  emailModalArtwork: Artwork | null;
  setEmailModalArtwork: (art: Artwork | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  addArtwork: (newArtData: Partial<Artwork>, file?: File) => Promise<boolean>;
  updateArtwork: (id: string, updatedData: Partial<Artwork>, file?: File) => Promise<boolean>;
  deleteArtwork: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  likeArtwork: (id: string) => void;
  submitEmailRequest: (artworkId: string, artworkTitle: string, artworkArtist: string, name: string, email: string, message?: string, artworkImageUrl?: string) => Promise<boolean>;
  deleteEmailRequest: (id: string) => void;
  submitArtistApplication: (appData: Omit<ArtistApplication, 'id' | 'timestamp' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: 'Pending' | 'Approved' | 'Reviewed') => void;
  deleteApplication: (id: string) => void;
}

const ArtContext = createContext<ArtContextType | undefined>(undefined);

export const ArtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const [emailRequests, setEmailRequests] = useState<EmailRequest[]>(() => {
    const saved = localStorage.getItem('artalystic_email_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved email requests:', e);
      }
    }
    return [
      {
        id: 'req-1',
        artworkId: 'art-1',
        artworkTitle: 'Echoes of Serenity',
        artworkArtist: 'Evelyn Vane',
        artworkImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675',
        requesterName: 'Sarah Jenkins',
        requesterEmail: 'sarah.j@example.com',
        message: 'I would love high-resolution detail photos and frame dimensions.',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Sent'
      }
    ];
  });

  const [applications, setApplications] = useState<ArtistApplication[]>(() => {
    const saved = localStorage.getItem('artalystic_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved applications:', e);
      }
    }
    return [
      {
        id: 'app-1',
        artistName: 'David K. Thorne',
        email: 'david.thorne@example.com',
        portfolioUrl: 'https://instagram.com/david_thorne_art',
        primaryCategory: 'Traditional Art',
        bio: 'Landscape oil painter focusing on rustic Scandinavian light and solitude.',
        artSampleUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'Pending'
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [emailModalArtwork, setEmailModalArtwork] = useState<Artwork | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Real-time Firestore Sync for 'artworks' collection
  useEffect(() => {
    const artworksRef = collection(db, 'artworks');
    const unsubscribe = onSnapshot(
      artworksRef,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log('Firestore artworks collection is empty. Seeding initial gallery pieces...');
          for (const art of initialArtworks) {
            try {
              const artDocRef = doc(artworksRef, art.id);
              await setDoc(artDocRef, artworkToDocData(art));
            } catch (err) {
              console.error('Error seeding initial artwork:', art.id, err);
            }
          }
        } else {
          const loadedArtworks = snapshot.docs.map((d) => docToArtwork(d));
          setArtworks(loadedArtworks);
        }
      },
      (error) => {
        console.error('Firestore Real-time listener error on artworks:', error);
        handleFirestoreError(error, OperationType.LIST, 'artworks');
      }
    );

    return () => unsubscribe();
  }, []);

  // Persist local auxiliary states
  useEffect(() => {
    localStorage.setItem('artalystic_email_requests', JSON.stringify(emailRequests));
  }, [emailRequests]);

  useEffect(() => {
    localStorage.setItem('artalystic_applications', JSON.stringify(applications));
  }, [applications]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addArtwork = async (newArtData: Partial<Artwork>, file?: File): Promise<boolean> => {
    try {
      let imageUrl = newArtData.imageUrl || '';
      let fileType = newArtData.fileType || 'image/png';

      if (file) {
        const uploadRes = await uploadArtworkToSupabase(file, 'artworks');
        if (uploadRes.error) {
          showToast(`Storage Upload Error: ${uploadRes.error}`, 'error');
          return false;
        }
        imageUrl = uploadRes.url;
        fileType = uploadRes.fileType;
      }

      const docData = artworkToDocData({
        ...newArtData,
        imageUrl,
        fileType
      });

      await addDoc(collection(db, 'artworks'), docData);
      showToast(`"${docData.title}" published to Firestore gallery!`, 'success');
      return true;
    } catch (err: any) {
      console.error('Error publishing artwork to Firestore:', err);
      handleFirestoreError(err, OperationType.CREATE, 'artworks');
      showToast(`Failed to publish artwork: ${err.message || 'Firestore error'}`, 'error');
      return false;
    }
  };

  const updateArtwork = async (
    id: string,
    updatedData: Partial<Artwork>,
    file?: File
  ): Promise<boolean> => {
    try {
      let imageUrl = updatedData.imageUrl;
      let fileType = updatedData.fileType;

      if (file) {
        const uploadRes = await uploadArtworkToSupabase(file, 'artworks');
        if (uploadRes.error) {
          showToast(`Storage Upload Error: ${uploadRes.error}`, 'error');
          return false;
        }
        imageUrl = uploadRes.url;
        fileType = uploadRes.fileType;
      }

      const updatePayload: any = {};
      if (updatedData.title !== undefined) updatePayload.title = updatedData.title;
      if (updatedData.artworkCode !== undefined) updatePayload.artworkCode = updatedData.artworkCode;
      if (updatedData.artist !== undefined || updatedData.artistName !== undefined) {
        updatePayload.artistName = updatedData.artistName || updatedData.artist;
      }
      if (updatedData.category !== undefined) updatePayload.category = updatedData.category;
      if (updatedData.medium !== undefined) updatePayload.medium = updatedData.medium;
      if (updatedData.dimensions !== undefined) updatePayload.dimensions = updatedData.dimensions;
      if (updatedData.year !== undefined) {
        updatePayload.year = parseInt(String(updatedData.year).replace(/\D/g, ''), 10) || 2026;
      }
      if (updatedData.description !== undefined) updatePayload.description = updatedData.description;
      if (updatedData.story !== undefined || updatedData.artistNote !== undefined) {
        updatePayload.artistNote = updatedData.artistNote || updatedData.story;
      }
      if (imageUrl !== undefined) updatePayload.imageUrl = imageUrl;
      if (fileType !== undefined) updatePayload.fileType = fileType;
      if (updatedData.available !== undefined) updatePayload.available = updatedData.available;
      if (updatedData.featured !== undefined) updatePayload.featured = updatedData.featured;

      await updateDoc(doc(db, 'artworks', id), updatePayload);
      showToast(`Artwork updated in Firestore gallery!`, 'success');
      return true;
    } catch (err: any) {
      console.error('Error updating artwork in Firestore:', err);
      handleFirestoreError(err, OperationType.UPDATE, `artworks/${id}`);
      showToast(`Failed to update artwork: ${err.message}`, 'error');
      return false;
    }
  };

  const deleteArtwork = async (id: string): Promise<void> => {
    const artToDelete = artworks.find((a) => a.id === id);
    try {
      await deleteDoc(doc(db, 'artworks', id));
      if (selectedArtwork?.id === id) setSelectedArtwork(null);
      showToast(`Artwork "${artToDelete?.title || id}" deleted from Firestore.`, 'info');
    } catch (err: any) {
      console.error('Error deleting artwork from Firestore:', err);
      handleFirestoreError(err, OperationType.DELETE, `artworks/${id}`);
      showToast(`Failed to delete artwork: ${err.message}`, 'error');
    }
  };

  const toggleFeatured = async (id: string): Promise<void> => {
    const target = artworks.find((a) => a.id === id);
    if (!target) return;
    try {
      await updateDoc(doc(db, 'artworks', id), {
        featured: !target.featured
      });
      showToast('Artwork spotlight status updated in Firestore.', 'info');
    } catch (err: any) {
      console.error('Error toggling featured in Firestore:', err);
      handleFirestoreError(err, OperationType.UPDATE, `artworks/${id}`);
    }
  };

  const toggleAvailability = async (id: string): Promise<void> => {
    const target = artworks.find((a) => a.id === id);
    if (!target) return;
    const newStatus = !target.available;
    try {
      await updateDoc(doc(db, 'artworks', id), {
        available: newStatus
      });
      showToast(`Artwork availability set to ${newStatus ? 'Available' : 'Unavailable/Sold'}.`, 'info');
    } catch (err: any) {
      console.error('Error toggling availability in Firestore:', err);
      handleFirestoreError(err, OperationType.UPDATE, `artworks/${id}`);
    }
  };

  const likeArtwork = (id: string) => {
    const target = artworks.find((a) => a.id === id);
    if (!target) return;
    updateDoc(doc(db, 'artworks', id), {
      likes: (target.likes || 0) + 1
    }).catch((err) => console.error('Error liking artwork:', err));
    showToast('Saved to your appreciated works!', 'success');
  };

  const submitEmailRequest = async (
    artworkId: string,
    artworkTitle: string,
    artworkArtist: string,
    name: string,
    email: string,
    message?: string,
    artworkImageUrl?: string
  ): Promise<boolean> => {
    try {
      await addDoc(collection(db, 'artworkEnquiries'), {
        name,
        email,
        artworkName: artworkTitle,
        message: message || '',
        status: 'new',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error writing to artworkEnquiries:', err);
      handleFirestoreError(err, OperationType.WRITE, 'artworkEnquiries');
    }

    const newReq: EmailRequest = {
      id: 'req-' + Date.now(),
      artworkId,
      artworkTitle,
      artworkArtist,
      artworkImageUrl,
      requesterName: name,
      requesterEmail: email,
      message,
      timestamp: new Date().toISOString(),
      status: 'Sent'
    };
    setEmailRequests((prev) => [newReq, ...prev]);
    showToast(`Artwork detail dossier dispatched to ${email}! Check your inbox.`, 'success');
    return true;
  };

  const deleteEmailRequest = (id: string) => {
    setEmailRequests((prev) => prev.filter((req) => req.id !== id));
    showToast('Visitor detail request record removed.', 'info');
  };

  const submitArtistApplication = (appData: Omit<ArtistApplication, 'id' | 'timestamp' | 'status'>) => {
    const newApp: ArtistApplication = {
      ...appData,
      id: 'app-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setApplications((prev) => [newApp, ...prev]);
    showToast('Thank you! Your artist collaboration submission has been received.', 'success');
  };

  const updateApplicationStatus = (id: string, status: 'Pending' | 'Approved' | 'Reviewed') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    showToast(`Application status updated to ${status}.`, 'info');
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    showToast('Artist application submission removed.', 'info');
  };

  return (
    <ArtContext.Provider
      value={{
        artworks,
        emailRequests,
        applications,
        activeTab,
        setActiveTab,
        selectedArtwork,
        setSelectedArtwork,
        emailModalArtwork,
        setEmailModalArtwork,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isAdmin,
        setIsAdmin,
        toasts,
        showToast,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        toggleFeatured,
        toggleAvailability,
        likeArtwork,
        submitEmailRequest,
        deleteEmailRequest,
        submitArtistApplication,
        updateApplicationStatus,
        deleteApplication
      }}
    >
      {children}
    </ArtContext.Provider>
  );
};

export const useArt = () => {
  const context = useContext(ArtContext);
  if (!context) {
    throw new Error('useArt must be used within an ArtProvider');
  }
  return context;
};
