import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Search, Filter, ChevronRight, CalendarDays, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const initialNewsArticles = [
  {
    id: 'innovation-rank',
    title: 'Abraham University Ranks #1 in Innovation Nationally',
    date: '2025-06-10',
    category: 'university_news',
    author: 'AU News Desk',
    excerpt: 'Our university has been recognized for groundbreaking research, entrepreneurial spirit, and innovative teaching methods by the National University Rankings.',
    image: 'University campus with a modern, innovative building',
    tags: ['ranking', 'innovation', 'research', 'academics'],
    content: `
      <p>Abraham University is proud to announce its top ranking for innovation in the latest National University Rankings. This prestigious recognition highlights our commitment to fostering a culture of creativity, cutting-edge research, and transformative educational experiences.</p>
      <p>The ranking acknowledges several key initiatives, including our state-of-the-art Innovation Hub, significant investments in faculty research projects, and a curriculum designed to equip students with future-ready skills. President Dr. Sarah Johnson commented, "This achievement is a testament to the hard work and dedication of our faculty, staff, and students who continually push the boundaries of knowledge and explore new frontiers."</p>
      <h2 class="text-2xl font-semibold my-4">Key Factors in Ranking:</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li>Launch of the Interdisciplinary AI Research Center.</li>
        <li>Record number of patents filed by faculty and students.</li>
        <li>Successful student-led startups incubated through the university's accelerator program.</li>
        <li>Integration of experiential learning across all undergraduate programs.</li>
      </ul>
      <p>Abraham University remains dedicated to advancing its mission of innovation and preparing leaders who can address complex global challenges.</p>
    `
  },
  {
    id: 'research-facility',
    title: 'New $50 Million State-of-the-Art Research Facility Opens',
    date: '2025-06-05',
    category: 'research',
    author: 'Dr. Emily Rodriguez, VP Research',
    excerpt: 'The new Advanced Technology Research Center (ATRC) will advance studies in biotechnology, artificial intelligence, and sustainable energy solutions.',
    image: 'Interior of a new, modern research facility with scientists',
    tags: ['research', 'biotechnology', 'ai', 'sustainability', 'campus_development'],
    content: `
      <p>Abraham University celebrated the grand opening of its new $50 million Advanced Technology Research Center (ATRC) today. This cutting-edge facility is poised to become a hub for interdisciplinary research, focusing on critical areas such as biotechnology, artificial intelligence, and sustainable energy.</p>
      <p>The ATRC spans 100,000 square feet and houses advanced laboratories, collaborative workspaces, and specialized equipment. "This facility represents a significant investment in our research capabilities and our commitment to solving real-world problems," said Dr. Emily Rodriguez, Vice President for Research. "It will provide our researchers and students with the tools they need to make groundbreaking discoveries."</p>
      <h2 class="text-2xl font-semibold my-4">ATRC Features:</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li>Bio-Safety Level 3 (BSL-3) laboratory.</li>
        <li>AI and Robotics development suite.</li>
        <li>Cleanroom for nanotechnology research.</li>
        <li>Sustainable energy systems testing lab.</li>
      </ul>
      <p>The center is expected to attract top talent and foster collaborations with industry partners, further solidifying Abraham University's position as a leader in research and innovation.</p>
    `
  },
  {
    id: 'graduation-2025',
    title: 'Record-Breaking Graduation Ceremony Celebrates Class of 2025',
    date: '2025-05-28',
    category: 'student_life',
    author: 'Office of Communications',
    excerpt: 'Over 5,000 students graduated this year, marking the largest and most diverse graduating class in Abraham University history. Keynote by alumna Dr. Chen.',
    image: 'Large graduation ceremony with students in caps and gowns',
    tags: ['graduation', 'students', 'alumni', 'commencement'],
    content: `
      <p>Abraham University celebrated its largest and most diverse graduating class at the 2025 Commencement ceremony. Over 5,000 undergraduate, graduate, and doctoral students received their degrees in a joyous event attended by families, friends, and faculty.</p>
      <p>The keynote address was delivered by distinguished alumna Dr. Lena Chen (Class of '98), a Nobel laureate in Physics. Dr. Chen inspired graduates to "embrace challenges, pursue your passions with vigor, and use your education to make a positive impact on the world."</p>
      <p>President Dr. Sarah Johnson congratulated the graduates, stating, "The Class of 2025 has demonstrated remarkable resilience and academic excellence. We are incredibly proud of their achievements and look forward to seeing the contributions they will make in their respective fields."</p>
      <h2 class="text-2xl font-semibold my-4">Highlights of the Ceremony:</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li>Conferral of honorary doctorates to three distinguished individuals.</li>
        <li>Student speaker awards for outstanding academic and community contributions.</li>
        <li>Performances by the University Symphony Orchestra and Choir.</li>
      </ul>
      <p>The ceremony concluded with the traditional cap toss, marking the official transition from students to proud alumni of Abraham University.</p>
    `
  },
  {
    id: 'global-study-expansion',
    title: 'University Expands Global Study Programs to South America and Africa',
    date: '2025-04-15',
    category: 'academics',
    author: 'International Programs Office',
    excerpt: 'New partnerships will offer students immersive study abroad opportunities in Brazil, Argentina, Kenya, and Ghana, focusing on sustainability and cultural exchange.',
    image: 'Students participating in a study abroad program in a vibrant cultural setting',
    tags: ['study_abroad', 'international', 'academics', 'global_engagement'],
    content: '<p>Content for global study expansion...</p>'
  },
  {
    id: 'arts-initiative-launch',
    title: 'New Arts and Humanities Initiative Launched with $10M Grant',
    date: '2025-03-20',
    category: 'arts_culture',
    author: 'Dean of Arts & Humanities',
    excerpt: 'The "Creative Futures" initiative will fund new faculty positions, student scholarships, and community arts projects over the next five years.',
    image: 'Students engaged in an art class or performance',
    tags: ['arts', 'humanities', 'grants', 'creativity', 'community'],
    content: '<p>Content for arts initiative launch...</p>'
  }
];

const newsCategories = [
  { id: 'all', name: 'All News' },
  { id: 'university_news', name: 'University News' },
  { id: 'academics', name: 'Academics' },
  { id: 'research', name: 'Research' },
  { id: 'student_life', name: 'Student Life' },
  { id: 'arts_culture', name: 'Arts & Culture' },
  { id: 'alumni', name: 'Alumni' },
];

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(initialNewsArticles);
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);


  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterArticles(term, selectedCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterArticles(searchTerm, categoryId);
  };

  const filterArticles = (term, category) => {
    let articles = initialNewsArticles;
    if (category !== 'all') {
      articles = articles.filter(article => article.category === category);
    }
    if (term) {
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    setFilteredArticles(articles);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleReadMore = (articleId) => {
     toast({
      title: "🚧 Full Article View",
      description: "This feature (displaying full article content on a separate page or modal) isn't implemented yet. You are seeing a preview. 🚀",
    });
    // For now, scroll to the article if it's on the page
    const element = document.getElementById(articleId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <Newspaper className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">University News</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Stay informed about the latest achievements, research breakthroughs, campus events, and community stories from Abraham University.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-8 bg-white shadow-sm sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news articles..."
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
                {newsCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* News Articles Grid/List */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {filteredArticles.length > 0 ? (
            <div className="space-y-12">
              {filteredArticles.map((article, index) => (
                <motion.article
                  id={article.id}
                  key={article.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-xl overflow-hidden group"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 xl:w-1/4">
                      <img-replace src={`https://source.unsplash.com/random/600x400/?${article.category}`} alt={article.image} className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6 md:p-8 flex-1">
                      <div className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wider">
                        {newsCategories.find(c => c.id === article.category)?.name || article.category}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 group-hover:text-gradient transition-colors">
                        {article.title}
                      </h2>
                      <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                        <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" /> {formatDate(article.date)}</span>
                        <span className="flex items-center"><UserCircle className="h-4 w-4 mr-1.5" /> By {article.author}</span>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">{article.excerpt}</p>
                      
                      {/* Collapsible full content preview */}
                      <details className="group/details mb-6">
                        <summary className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer flex items-center">
                          Read Full Story Preview <ChevronRight className="ml-1 h-4 w-4 group-hover/details:rotate-90 transition-transform" />
                        </summary>
                        <div className="prose prose-sm max-w-none mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: article.content || "<p>Full content coming soon.</p>" }} />
                      </details>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-gradient"
                        onClick={() => handleReadMore(article.id)}
                      >
                        View Full Article
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Newspaper className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No News Articles Found</h2>
              <p className="text-gray-500">Try adjusting your search or filter criteria, or check back later for new stories.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;