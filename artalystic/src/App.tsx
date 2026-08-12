import React from 'react';
import { ArtProvider, useArt } from './context/ArtContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { AboutPage } from './pages/AboutPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { EmailDetailModal } from './components/EmailDetailModal';
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeTab } = useArt();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ded9cf] text-[#1C1B1A]">
      <div>
        <Header />
        <main className="pt-6">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'explore' && <ExplorePage />}
          {activeTab === 'about' && <AboutPage />}
          {activeTab === 'community' && <CommunityPage />}
          {activeTab === 'contact' && <ContactPage />}
          {activeTab === 'admin' && <AdminPage />}
        </main>
      </div>

      <Footer />

      {/* Global Modals & Notifications */}
      <ArtworkDetailModal />
      <EmailDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ArtProvider>
      <MainContent />
    </ArtProvider>
  );
}
