import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background font-openSans">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/campus-life" element={<CampusLife />} />
            <Route path="/research" element={<Research />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/portals" element={<Portals />} />
            <Route path="/webapp/:userType" element={<WebApp />} />
            <Route path="/events" element={<Events />} />
            <Route path="/giving" element={<Giving />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/awards-application" element={<AwardsApplication />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;