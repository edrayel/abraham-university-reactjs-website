import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Search, Filter, Maximize, X } from 'lucide-react';

const initialImages = [
  { id: 1, srcQuery: 'university-campus-spring', alt: 'Vibrant university campus in spring', category: 'campus_life', tags: ['campus', 'spring', 'students', 'architecture'] },
  { id: 2, srcQuery: 'graduation-ceremony-joyful', alt: 'Joyful graduates tossing caps in the air', category: 'events', tags: ['graduation', 'students', 'celebration'] },
  { id: 3, srcQuery: 'modern-library-interior-studying', alt: 'Students studying in a modern library', category: 'academics', tags: ['library', 'study', 'students', 'learning'] },
  { id: 4, srcQuery: 'research-lab-scientists', alt: 'Scientists working in a high-tech research lab', category: 'research', tags: ['research', 'science', 'lab', 'innovation'] },
  { id: 5, srcQuery: 'university-sports-team-action', alt: 'University sports team in action during a game', category: 'sports', tags: ['sports', 'athletics', 'team', 'competition'] },
  { id: 6, srcQuery: 'student-art-exhibition', alt: 'Students admiring artwork at an exhibition', category: 'arts_culture', tags: ['art', 'culture', 'exhibition', 'students'] },
  { id: 7, srcQuery: 'campus-autumn-foliage', alt: 'Beautiful autumn foliage on campus', category: 'campus_life', tags: ['campus', 'autumn', 'nature', 'scenery'] },
  { id: 8, srcQuery: 'guest-speaker-lecture-hall', alt: 'Guest speaker addressing students in a lecture hall', category: 'events', tags: ['lecture', 'speaker', 'event', 'learning'] },
  { id: 9, srcQuery: 'students-collaborating-project', alt: 'Diverse group of students collaborating on a project', category: 'academics', tags: ['students', 'collaboration', 'teamwork', 'project'] },
  { id: 10, srcQuery: 'drone-shot-university-overview', alt: 'Aerial drone shot of the entire university campus', category: 'campus_life', tags: ['campus', 'aerial', 'overview', 'architecture'] },
  { id: 11, srcQuery: 'volunteer-students-community-service', alt: 'Students participating in a community service event', category: 'student_life', tags: ['volunteer', 'community', 'students', 'service'] },
  { id: 12, srcQuery: 'music-performance-on-stage', alt: 'Student music group performing on stage', category: 'arts_culture', tags: ['music', 'performance', 'arts', 'students'] },
];

const imageCategories = [
  { id: 'all', name: 'All Images' },
  { id: 'campus_life', name: 'Campus Life' },
  { id: 'academics', name: 'Academics' },
  { id: 'research', name: 'Research' },
  { id: 'events', name: 'Events' },
  { id: 'sports', name: 'Sports' },
  { id: 'arts_culture', name: 'Arts & Culture' },
  { id: 'student_life', name: 'Student Life' },
];

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredImages, setFilteredImages] = useState(initialImages);
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterImages(term, selectedCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterImages(searchTerm, categoryId);
  };

  const filterImages = (term, category) => {
    let images = initialImages;
    if (category !== 'all') {
      images = images.filter(img => img.category === category);
    }
    if (term) {
      images = images.filter(img =>
        img.alt.toLowerCase().includes(term) ||
        (img.tags && img.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    setFilteredImages(images);
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <ImageIcon className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">University Gallery</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Explore the vibrant life, stunning campus, and memorable moments at Abraham University through our visual gallery.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white shadow-sm sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search images by keyword or tag..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="relative w-full md:w-auto md:min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                {imageCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden card-hover group aspect-square cursor-pointer"
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative w-full h-full">
                    <img-replace src={`https://source.unsplash.com/random/500x500/?${image.srcQuery}`} alt={image.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Maximize className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-xs truncate">{image.alt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ImageIcon className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Images Found</h2>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </div>
      </section>

      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            <img-replace src={`https://source.unsplash.com/random/1200x800/?${lightboxImage.srcQuery}`} alt={lightboxImage.alt} className="block max-w-full max-h-[80vh] object-contain" />
            <button 
              onClick={closeLightbox} 
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-center">{lightboxImage.alt}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;