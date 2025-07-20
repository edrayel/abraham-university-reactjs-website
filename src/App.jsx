import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import ApiStatusIndicator from '@/components/ui/ApiStatusIndicator';
import Home from '@/pages/Home.jsx';
import About from '@/pages/About.jsx';
import Academics from '@/pages/Academics.jsx';
import Admissions from '@/pages/Admissions.jsx';
import CampusLife from '@/pages/CampusLife.jsx';
import Research from '@/pages/Research.jsx';
import Contact from '@/pages/Contact.jsx';
import Portals from '@/pages/Portals.jsx';
import WebApp from '@/pages/WebApp.jsx';
import Events from '@/pages/Events.jsx';
import Giving from '@/pages/Giving.jsx';
import Visit from '@/pages/Visit.jsx';
import NewsPage from '@/pages/NewsPage.jsx';
import AwardsApplication from '@/pages/AwardsApplication.jsx';
import Alumni from '@/pages/Alumni.jsx';
import Gallery from '@/pages/Gallery.jsx';
import ApiTest from '@/pages/ApiTest.jsx';

// Wrapper component for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/academics" element={<PageTransition><Academics /></PageTransition>} />
        <Route path="/admissions" element={<PageTransition><Admissions /></PageTransition>} />
        <Route path="/campus-life" element={<PageTransition><CampusLife /></PageTransition>} />
        <Route path="/research" element={<PageTransition><Research /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/portals" element={<PageTransition><Portals /></PageTransition>} />
        <Route path="/webapp/:userType" element={<PageTransition><WebApp /></PageTransition>} />
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/giving" element={<PageTransition><Giving /></PageTransition>} />
        <Route path="/visit" element={<PageTransition><Visit /></PageTransition>} />
        <Route path="/news" element={<PageTransition><NewsPage /></PageTransition>} />
        <Route path="/awards-application" element={<PageTransition><AwardsApplication /></PageTransition>} />
        <Route path="/alumni" element={<PageTransition><Alumni /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        {/* Only available in development mode */}
        {import.meta.env.DEV && (
          <Route path="/api-test" element={<PageTransition><ApiTest /></PageTransition>} />
        )}
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background font-openSans">
        <Header />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster />
        {/* Only show API status indicator in development mode */}
        {import.meta.env.DEV && <ApiStatusIndicator />}
      </div>
    </Router>
  );
}

export default App;