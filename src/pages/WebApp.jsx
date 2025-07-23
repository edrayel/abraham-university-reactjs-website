import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Home, Settings, UserCircle, FileText, Calendar, DollarSign, Briefcase, Building, UserCog, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import usePortalsStore from '@/stores/usePortalsStore';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingState from '@/components/common/LoadingState';

// Default user type details as fallback
const defaultUserTypeDetails = {
  student: { title: 'Student WebApp', icon: UserCircle, features: ['View Grades', 'Course Registration', 'Library Access', 'Student Services'] },
  parent: { title: 'Parent WebApp', icon: UserCircle, features: ['Student Progress', 'Fee Payment', 'Notifications', 'University News'] },
  alumni: { title: 'Alumni WebApp', icon: UserCog, features: ['Networking', 'Events', 'Career Services', 'Giving Back'] },
  faculty: { title: 'Faculty WebApp', icon: Briefcase, features: ['Course Management', 'Research Tools', 'Student Advising', 'Academic Calendar'] },
  staff: { title: 'Staff WebApp', icon: Briefcase, features: ['HR Portal', 'Payroll', 'Benefits Information', 'Internal Memos'] },
  vendor: { title: 'Vendor WebApp', icon: Building, features: ['Contract Management', 'Invoice Submission', 'Communication Hub', 'Service Status'] },
  admin: { title: 'Admin WebApp', icon: Settings, features: ['User Management', 'System Analytics', 'Content Management', 'Security Settings'] },
};

const WebApp = () => {
  const { userType } = useParams();
  const { 
    studentPortal, 
    facultyPortal, 
    staffPortal, 
    alumniPortal, 
    parentPortal,
    isLoading, 
    error, 
    fetchAllData,
    getPortalByType 
  } = usePortalsStore();

  useEffect(() => {
    fetchAllData().catch(error => {
      console.error('Failed to fetch portals data:', error);
    });
  }, [fetchAllData]);

  // Get portal data from store or fall back to default
  const portalData = getPortalByType(userType);
  
  // Determine which icon to use based on user type
  const getIconForUserType = (type) => {
    switch(type) {
      case 'student': return UserCircle;
      case 'parent': return UserCircle;
      case 'alumni': return UserCog;
      case 'faculty': return Briefcase;
      case 'staff': return Briefcase;
      case 'vendor': return Building;
      case 'admin': return Settings;
      default: return AlertTriangle;
    }
  };

  // Combine API data with defaults
  const details = portalData ? {
    title: portalData.title || `${userType.charAt(0).toUpperCase() + userType.slice(1)} WebApp`,
    icon: getIconForUserType(userType),
    features: portalData.features || defaultUserTypeDetails[userType]?.features || ['Feature not available for this user type.']
  } : defaultUserTypeDetails[userType] || { 
    title: 'WebApp', 
    icon: AlertTriangle, 
    features: ['Feature not available for this user type.'] 
  };

  const handleFeatureClick = (featureName) => {
    toast({
      title: `🚧 ${featureName}`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-yellow-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/portals" className="flex items-center text-victorian-dark hover:text-yellow-600 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Portals
          </Link>
          <div className="flex items-center">
            <details.icon className="h-8 w-8 text-yellow-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">{details.title}</h1>
          </div>
          <Button variant="outline" onClick={() => handleFeatureClick('Settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <LoadingState type="section" message="Loading portal data..." />
        ) : error ? (
          <ErrorBoundary
            error={error}
            message="We're having trouble loading portal information right now. Please try again."
            onRetry={() => fetchAllData()}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-2xl"
          >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-800 mb-3">Welcome to the {details.title}!</h2>
            <p className="text-lg text-gray-600">
              This is your personalized dashboard. Access key features and information below.
            </p>
          </div>

          {defaultUserTypeDetails[userType] ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {details.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer card-hover"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <div className="flex items-center mb-3">
                    {/* Placeholder for feature-specific icons if needed */}
                    {feature.toLowerCase().includes('grade') && <FileText className="h-6 w-6 text-yellow-500 mr-3" />}
                    {feature.toLowerCase().includes('course') && <Calendar className="h-6 w-6 text-green-500 mr-3" />}
                    {feature.toLowerCase().includes('payment') && <DollarSign className="h-6 w-6 text-yellow-500 mr-3" />}
                    {! (feature.toLowerCase().includes('grade') || feature.toLowerCase().includes('course') || feature.toLowerCase().includes('payment')) && <details.icon className="h-6 w-6 text-indigo-500 mr-3" />}
                    <h3 className="text-xl font-medium text-gray-700">{feature}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Click to access {feature.toLowerCase()}.</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-red-600 mb-2">Invalid User Type</h2>
              <p className="text-gray-600">The requested web application portal does not exist.</p>
              <Button asChild className="mt-6">
                <Link to="/portals">
                  <Home className="mr-2 h-4 w-4" /> Go to Portals
                </Link>
              </Button>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center border-t pt-8"
          >
            <p className="text-gray-600">
              Having trouble? <Link to="/contact" className="text-victorian-dark hover:underline">Contact Support</Link>.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Abraham University WebApp © 2025
            </p>
          </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WebApp;