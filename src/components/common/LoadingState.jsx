import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Reusable loading state component with customizable layouts
 * Provides consistent loading experience across all pages
 */
const LoadingState = ({ 
  type = 'page', // 'page', 'section', 'card', 'inline'
  message = 'Loading...', 
  showSpinner = true,
  className = ''
}) => {
  const getLoadingContent = () => {
    switch (type) {
      case 'page':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {showSpinner && (
                <Loader2 className="h-12 w-12 mx-auto text-blue-600 mb-4 animate-spin" />
              )}
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{message}</h2>
              <p className="text-gray-500">Please wait while we fetch the latest information.</p>
            </motion.div>
          </div>
        );

      case 'section':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${className}`}
          >
            {showSpinner && (
              <Loader2 className="h-8 w-8 mx-auto text-blue-600 mb-4 animate-spin" />
            )}
            <h3 className="text-lg font-medium text-gray-700 mb-2">{message}</h3>
            <p className="text-gray-500">This will only take a moment.</p>
          </motion.div>
        );

      case 'card':
        return (
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden animate-pulse ${className}`}>
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'inline':
        return (
          <div className={`flex items-center gap-2 ${className}`}>
            {showSpinner && (
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            )}
            <span className="text-gray-600">{message}</span>
          </div>
        );

      default:
        return (
          <div className={`text-center ${className}`}>
            {showSpinner && (
              <Loader2 className="h-6 w-6 mx-auto text-blue-600 mb-2 animate-spin" />
            )}
            <p className="text-gray-600">{message}</p>
          </div>
        );
    }
  };

  return getLoadingContent();
};

/**
 * Skeleton loading component for grid layouts
 */
export const SkeletonGrid = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <LoadingState key={index} type="card" />
      ))}
    </div>
  );
};

/**
 * Hero section skeleton
 */
export const HeroSkeleton = () => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-12 bg-white/20 rounded mb-6 animate-pulse"></div>
          <div className="h-6 bg-white/20 rounded max-w-3xl mx-auto mb-8 animate-pulse"></div>
          <div className="h-10 w-48 bg-white/20 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default LoadingState;