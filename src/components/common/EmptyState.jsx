import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileX, 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Building, 
  Search,
  Database,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Comprehensive empty state component for when endpoints return no data
 * Provides consistent messaging and actions across all pages
 */
const EmptyState = ({ 
  type = 'generic', // 'generic', 'search', 'events', 'news', 'faculty', 'programs', 'gallery', 'portals'
  title = null,
  message = null,
  onRetry = null,
  onAction = null,
  actionLabel = null,
  showRetry = true,
  className = ''
}) => {
  const getEmptyStateConfig = () => {
    const configs = {
      generic: {
        icon: FileX,
        iconColor: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        title: 'No Content Available',
        message: 'There is currently no content to display in this section.',
        suggestion: 'Please check back later or contact us if you believe this is an error.'
      },
      search: {
        icon: Search,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        title: 'No Results Found',
        message: 'We couldn\'t find any content matching your search criteria.',
        suggestion: 'Try adjusting your search terms or browse our available content.'
      },
      events: {
        icon: Calendar,
        iconColor: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: 'No Upcoming Events',
        message: 'There are currently no scheduled events to display.',
        suggestion: 'Check back soon for new events, or view our past events archive.'
      },
      news: {
        icon: FileX,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        title: 'No News Articles',
        message: 'There are currently no news articles available.',
        suggestion: 'Stay tuned for the latest updates and announcements from our university.'
      },
      faculty: {
        icon: Users,
        iconColor: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        title: 'No Faculty Information',
        message: 'Faculty information is currently being updated.',
        suggestion: 'Please contact the academic office for current faculty details.'
      },
      programs: {
        icon: GraduationCap,
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        title: 'No Programs Available',
        message: 'Academic program information is currently being updated.',
        suggestion: 'Contact our admissions office for the most current program offerings.'
      },
      gallery: {
        icon: FileX,
        iconColor: 'text-pink-500',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200',
        title: 'No Images Available',
        message: 'The gallery is currently empty or being updated.',
        suggestion: 'Check back soon for new photos and campus highlights.'
      },
      portals: {
        icon: Building,
        iconColor: 'text-teal-500',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        title: 'Portal Access Unavailable',
        message: 'Portal information is currently being configured.',
        suggestion: 'Please contact IT support for assistance with portal access.'
      },
      data: {
        icon: Database,
        iconColor: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        title: 'No Data Available',
        message: 'The requested information is currently unavailable.',
        suggestion: 'This may be temporary. Please try again later or contact support.'
      }
    };

    return configs[type] || configs.generic;
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center justify-center py-16 px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-8 shadow-sm`}>
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white rounded-full shadow-sm">
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {title || config.title}
          </h3>

          {/* Main Message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {message || config.message}
          </p>

          {/* Suggestion */}
          <p className="text-sm text-gray-600 mb-6">
            {config.suggestion}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showRetry && onRetry && (
              <Button 
                onClick={onRetry} 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            )}
            
            {onAction && actionLabel && (
              <Button 
                onClick={onAction} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {actionLabel}
              </Button>
            )}
          </div>

          {/* Contact Support Link */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Questions about this content?{' '}
              <a 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Compact empty state for smaller sections
 */
export const CompactEmptyState = ({ 
  type = 'generic',
  message = 'No content available',
  onRetry = null,
  className = ''
}) => {
  const config = {
    generic: { icon: FileX, color: 'text-gray-500' },
    search: { icon: Search, color: 'text-blue-500' },
    events: { icon: Calendar, color: 'text-green-500' },
    news: { icon: FileX, color: 'text-purple-500' },
    faculty: { icon: Users, color: 'text-indigo-500' },
    programs: { icon: GraduationCap, color: 'text-orange-500' },
    gallery: { icon: FileX, color: 'text-pink-500' },
    portals: { icon: Building, color: 'text-teal-500' },
    data: { icon: Database, color: 'text-gray-500' }
  };

  const { icon: IconComponent, color } = config[type] || config.generic;

  return (
    <div className={`text-center py-8 ${className}`}>
      <IconComponent className={`w-12 h-12 mx-auto mb-4 ${color}`} />
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default EmptyState;