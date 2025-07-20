import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { API_ENDPOINTS } from '../config/api';

/**
 * ApiTest Component
 * 
 * This page is used to test the connection to the WordPress API and display the results.
 * It can be used during development to verify that all API endpoints are accessible.
 */
const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAllEndpoints = async () => {
      setIsLoading(true);
      setError(null);
      
      const results = {};
      const endpoints = [
        { name: 'Home', method: apiService.getHomeData },
        { name: 'Academics', method: apiService.getAcademicsData },
        { name: 'Faculty', method: apiService.getFacultyData },
        { name: 'Events', method: apiService.getEventsData },
        { name: 'News', method: apiService.getNewsData },
        { name: 'Admissions', method: apiService.getAdmissionsData },
        { name: 'About', method: apiService.getAboutData },
        { name: 'Contact', method: apiService.getContactData },
        { name: 'Campus Life', method: apiService.getCampusLifeData },
        { name: 'Research', method: apiService.getResearchData },
        { name: 'Alumni', method: apiService.getAlumniData },
        { name: 'Giving', method: apiService.getGivingData },
        { name: 'Visit', method: apiService.getVisitData },
        { name: 'Portals', method: apiService.getPortalsData },
      ];

      for (const endpoint of endpoints) {
        try {
          const startTime = performance.now();
          const response = await endpoint.method();
          const endTime = performance.now();
          
          results[endpoint.name] = {
            status: 'success',
            responseTime: Math.round(endTime - startTime),
            data: response
          };
        } catch (err) {
          results[endpoint.name] = {
            status: 'error',
            message: err.message || 'Unknown error'
          };
        }
      }

      setTestResults(results);
      setIsLoading(false);
    };

    testAllEndpoints();
  }, []);

  const handleRetryAll = () => {
    setTestResults({});
    setIsLoading(true);
    setError(null);
    
    // Re-run the effect
    const testAllEndpoints = async () => {
      // Same code as in the useEffect
      // This is duplicated for clarity
      const results = {};
      const endpoints = [
        { name: 'Home', method: apiService.getHomeData },
        { name: 'Academics', method: apiService.getAcademicsData },
        { name: 'Faculty', method: apiService.getFacultyData },
        { name: 'Events', method: apiService.getEventsData },
        { name: 'News', method: apiService.getNewsData },
        { name: 'Admissions', method: apiService.getAdmissionsData },
        { name: 'About', method: apiService.getAboutData },
        { name: 'Contact', method: apiService.getContactData },
        { name: 'Campus Life', method: apiService.getCampusLifeData },
        { name: 'Research', method: apiService.getResearchData },
        { name: 'Alumni', method: apiService.getAlumniData },
        { name: 'Giving', method: apiService.getGivingData },
        { name: 'Visit', method: apiService.getVisitData },
        { name: 'Portals', method: apiService.getPortalsData },
      ];

      for (const endpoint of endpoints) {
        try {
          const startTime = performance.now();
          const response = await endpoint.method();
          const endTime = performance.now();
          
          results[endpoint.name] = {
            status: 'success',
            responseTime: Math.round(endTime - startTime),
            data: response
          };
        } catch (err) {
          results[endpoint.name] = {
            status: 'error',
            message: err.message || 'Unknown error'
          };
        }
      }

      setTestResults(results);
      setIsLoading(false);
    };

    testAllEndpoints();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Testing connection to WordPress API endpoints at: 
          <code className="bg-gray-100 px-2 py-1 rounded">{API_ENDPOINTS.HOME}</code>
        </p>
        
        <button 
          onClick={handleRetryAll}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Retry All'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(testResults).map(([endpointName, result]) => (
            <div 
              key={endpointName}
              className={`border rounded-lg overflow-hidden shadow-sm ${result.status === 'success' ? 'border-green-200' : 'border-red-200'}`}
            >
              <div className={`px-4 py-3 ${result.status === 'success' ? 'bg-green-50' : 'bg-red-50'} border-b flex justify-between items-center`}>
                <h3 className="font-medium">{endpointName}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {result.status === 'success' ? 'Success' : 'Failed'}
                </span>
              </div>
              
              <div className="p-4">
                {result.status === 'success' ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Response time: <span className="font-medium">{result.responseTime}ms</span>
                    </p>
                    <div className="mt-2">
                      <details>
                        <summary className="cursor-pointer text-sm text-blue-500 hover:text-blue-700">View Response Data</summary>
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-red-600">
                    Error: {result.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest;