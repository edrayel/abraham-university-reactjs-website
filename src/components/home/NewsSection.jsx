import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const newsData = [
  {
    title: 'Abraham University Ranks #1 in Innovation',
    date: 'June 10, 2025',
    excerpt: 'Our university has been recognized for groundbreaking research and innovative teaching methods.',
    imageAlt: 'University campus with a focus on a modern building',
    imageQuery: 'university-innovation-news',
    link: '/news#innovation-rank',
  },
  {
    title: 'New State-of-the-Art Research Facility Opens',
    date: 'June 5, 2025',
    excerpt: 'The new $50 million research center will advance studies in biotechnology and artificial intelligence.',
    imageAlt: 'Interior of a new research facility with scientists',
    imageQuery: 'research-facility-news',
    link: '/news#research-facility',
  },
  {
    title: 'Record-Breaking Graduation Ceremony',
    date: 'May 28, 2025',
    excerpt: 'Over 5,000 students graduated this year, marking the largest graduating class in university history.',
    imageAlt: 'Graduation ceremony with students in caps and gowns',
    imageQuery: 'graduation-ceremony-news',
    link: '/news#graduation-2025',
  },
];

const NewsSection = () => {
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
            Latest <span className="text-primary">News</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings at Abraham University.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group"
            >
              <Link to={article.link} className="block">
                <div className="h-56 relative overflow-hidden">
                  <img-replace src={`https://source.unsplash.com/random/400x300/?${article.imageQuery}`} alt={article.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">{article.date}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-primary transition-colors font-libreBaskerville">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center text-primary font-medium group-hover:underline">
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
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