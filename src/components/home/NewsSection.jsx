import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUniversityStore from '@/stores/homeStore';

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Extracts excerpt from content or uses provided excerpt
 * @param {string} content - HTML content
 * @param {string} excerpt - Provided excerpt
 * @returns {string} Clean excerpt text
 */
const getExcerpt = (content, excerpt) => {
  if (excerpt && excerpt.trim()) {
    return excerpt;
  }
  
  // Strip HTML tags and get first 150 characters
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  return textContent.length > 150 
    ? textContent.substring(0, 150) + '...'
    : textContent;
};

const NewsSection = () => {
  const { latestNews } = useUniversityStore();

  // Don't render the section if there's no news data
  if (!latestNews || latestNews.length === 0) {
    return null;
  }

  // Limit to first 3 news articles for the home page
  const displayNews = latestNews.slice(0, 3);

  return (
    <section className="section-padding bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-libreBaskerville">
            Latest <span className="text-gradient">News</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings at Abraham University.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((article, index) => {
            const excerpt = getExcerpt(article.content, article.excerpt);
            const formattedDate = formatDate(article.date);
            const imageUrl = article.featured_image || article.image || `https://source.unsplash.com/random/400x300/?university-news`;
            
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-dark rounded-md shadow-lg overflow-hidden card-hover group"
              >
                <Link to={article.permalink || `/news/${article.slug}`} className="block">
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={article.alt || article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        e.target.src = `https://source.unsplash.com/random/400x300/?university-news`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-primary-foreground font-semibold mb-2 uppercase tracking-wider">
                      {formattedDate}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-white transition-colors font-libreBaskerville">
                      {article.title}
                    </h3>
                    <p className="text-primary-foreground/90 text-sm mb-4 line-clamp-3">
                      {excerpt}
                    </p>
                    {article.categories && article.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.categories.slice(0, 2).map((category) => (
                          <span 
                            key={category.id} 
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-primary-foreground font-medium group-hover:underline text-sm">
                      Read More
                      <ChevronRight className="ml-1 h-4 w-4 inline-block align-middle" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary/90 rounded-md px-8 py-3">
            <Link to="/news">View All News</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;