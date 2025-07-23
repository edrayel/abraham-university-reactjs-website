import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api';

/**
 * ApiStatusIndicator Component
 * 
 * This component checks the connection to the WordPress API and displays the status.
 * It can be used during development to verify that the API is accessible.
 */
const ApiStatusIndicator = ({ endpoint = API_ENDPOINTS.HOME, interval = 60000 }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [lastChecked, setLastChecked] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [authStatus, setAuthStatus] = useState('unknown'); // 'unknown', 'authenticated', 'unauthenticated'

  const checkApiConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setStatus('checking');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint, { 
        method: 'GET',
        headers: API_CONFIG.headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('connected');
        setAuthStatus('authenticated');
        setErrorMessage('');
      } else {
        setStatus('error');
        
        // Check if the error is related to authentication
        if (response.status === 401) {
          setAuthStatus('unauthenticated');
          setErrorMessage('Authentication failed: Invalid or missing API key');
        } else {
          setAuthStatus('unknown');
          setErrorMessage(`API error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      setStatus('error');
      
      if (error.name === 'AbortError') {
        setAuthStatus('unknown');
        setErrorMessage('Connection timeout. API server may be down.');
      } else if (!navigator.onLine) {
        setAuthStatus('unknown');
        setErrorMessage('You are offline. Please check your internet connection.');
      } else if (error.message && error.message.includes('401')) {
        setAuthStatus('unauthenticated');
        setErrorMessage('Authentication failed: Invalid or missing API key');
      } else {
        setAuthStatus('unknown');
        setErrorMessage(error.message || 'Unknown error');
      }
    } finally {
      setLastChecked(new Date());
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkApiConnection();
    
    // Set up interval to check connection periodically
    const intervalId = setInterval(checkApiConnection, interval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [endpoint, interval]);

  // Format the last checked time
  const formattedLastChecked = lastChecked 
    ? lastChecked.toLocaleTimeString() 
    : 'Never';

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex items-center space-x-2 text-sm border border-gray-200 dark:border-gray-700">
      {status === 'checking' && (
        <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      )}
      
      {status === 'connected' && (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )}
      
      {status === 'error' && (
        <AlertCircle className="h-4 w-4 text-red-500" />
      )}
      
      <div>
        <div className="font-medium">
          {status === 'checking' && 'Loading...'}
          {status === 'connected' && 'API Connected'}
          {status === 'error' && 'API Error'}
        </div>
        
        {status === 'error' && (
          <div className="text-xs text-red-500">{errorMessage}</div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last checked: {formattedLastChecked}
        </div>
        
        <div className="text-xs">
          {authStatus === 'authenticated' && (
            <span className="text-green-500">Authenticated ✓</span>
          )}
          {authStatus === 'unauthenticated' && (
            <span className="text-red-500">Authentication Failed ✗</span>
          )}
          {authStatus === 'unknown' && (
            <span className="text-gray-500">Auth Status Unknown</span>
          )}
        </div>
      </div>
      
      <button 
        onClick={checkApiConnection}
        disabled={isChecking}
        className="ml-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Check API connection"
      >
        <RefreshCw className="h-3 w-3 text-gray-500" />
      </button>
    </div>
  );
};

export default ApiStatusIndicator;