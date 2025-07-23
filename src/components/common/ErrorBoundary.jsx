import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Comprehensive error display component for graceful API downtime handling
 * Provides user-friendly messages and recovery options
 */
const ErrorBoundary = ({ 
  error, 
  onRetry, 
  showHomeButton = true, 
  customMessage = null,
  errorType = 'api' // 'api', 'network', 'timeout', 'server', 'generic'
}) => {
  const getErrorConfig = () => {
    const errorMessage = error?.message?.toLowerCase() || '';
    
    // Determine error type from message if not explicitly provided
    let detectedType = errorType;
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      detectedType = 'network';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
      detectedType = 'timeout';
    } else if (errorMessage.includes('500') || errorMessage.includes('server')) {
      detectedType = 'server';
    }

    const configs = {
      network: {
        icon: WifiOff,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Connection Problem',
        message: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
        suggestion: 'This usually resolves itself within a few minutes. If the problem persists, please contact our IT support.'
      },
      timeout: {
        icon: AlertTriangle,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        title: 'Request Timeout',
        message: 'The request is taking longer than expected. Our servers might be experiencing high traffic.',
        suggestion: 'Please try again in a moment. If this continues, our technical team has been notified.'
      },
      server: {
        icon: AlertTriangle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Server Maintenance',
        message: 'Our servers are currently undergoing maintenance or experiencing technical difficulties.',
        suggestion: 'We apologize for the inconvenience. Please try again in a few minutes, or contact support if urgent.'
      },
      api: {
        icon: Wifi,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        title: 'Service Temporarily Unavailable',
        message: 'We\'re experiencing temporary issues with our data services. Our technical team is working to resolve this quickly.',
        suggestion: 'Please try refreshing the page or check back in a few minutes. Thank you for your patience.'
      },
      generic: {
        icon: AlertTriangle,
        iconColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        title: 'Something Went Wrong',
        message: 'We encountered an unexpected issue while loading this content.',
        suggestion: 'Please try refreshing the page. If the problem continues, our support team can help.'
      }
    };

    return configs[detectedType] || configs.generic;
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-8 shadow-sm`}>
          {/* Icon */}
          <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-white rounded-full shadow-sm`}>
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {config.title}
          </h3>

          {/* Main Message */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {customMessage || config.message}
          </p>

          {/* Suggestion */}
          <p className="text-sm text-gray-600 mb-6">
            {config.suggestion}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            )}
            
            {showHomeButton && (
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            )}
          </div>

          {/* Contact Support Link */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need immediate assistance?{' '}
              <a 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorBoundary;