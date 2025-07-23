import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, FileText, CheckSquare, Calendar, Users, ArrowRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import apiService from '../services/apiService';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingState from '@/components/common/LoadingState';

// Icon mapping for application steps
const iconMap = {
  'check-square': CheckSquare,
  'file-text': FileText,
  'calendar': Calendar,
  'edit': Edit,
  'users': Users,
};



const AwardsApplication = () => {
  const [awardsData, setAwardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwardsData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAwardsData();
        setAwardsData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching awards data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwardsData();
  }, []);

  const handleApplyClick = (scholarship) => {
    if (scholarship.apply_url) {
      window.open(scholarship.apply_url, '_blank');
    } else {
      toast({
        title: `🚧 Apply for ${scholarship.title}`,
        description: "The application portal for this award isn't implemented yet. Please check back later or contact the financial aid office. 🚀",
      });
    }
  };

  const handleLearnMoreClick = (scholarship) => {
    if (scholarship.learn_more_url) {
      window.open(scholarship.learn_more_url, '_blank');
    } else {
      toast({
        title: `Learn More about ${scholarship.title}`,
        description: "More information isn't available yet. Please contact the financial aid office.",
      });
    }
  };

  const handleGeneralApplyClick = () => {
    if (awardsData?.page_settings?.application_portal_url) {
      window.open(awardsData.page_settings.application_portal_url, '_blank');
    } else {
      toast({
        title: "🚧 General Application Portal",
        description: "The general scholarship application portal isn't implemented yet. 🚀",
      });
    }
  };

  if (loading) {
    return <LoadingState type="page" message="Loading awards and scholarships..." />;
  }

  if (error) {
    return (
      <ErrorBoundary
        error={{ message: error }}
        message="We're having trouble loading awards and scholarship information right now. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { scholarships = [], page_settings = {}, application_steps = [], contact_info = {} } = awardsData || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-60 pb-40 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >

            <h1 className="text-5xl md:text-6xl font-bold mb-6">{page_settings.title || 'Awards & Scholarships'}</h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              {page_settings.subtitle || 'Discover various scholarship and award opportunities available to support your academic journey at Abraham University.'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Available <span className="text-gradient">Scholarships</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a range of scholarships based on merit, need, and specific talents. Explore the options below.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={scholarship.image_url || `https://source.unsplash.com/random/600x400/?scholarship-award`} 
                    alt={`${scholarship.title} visual representation`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-2xl font-semibold text-white mb-1">{scholarship.title}</h3>
                    <p className="text-lg font-medium text-sky-300">{scholarship.amount}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-700 mb-2"><strong className="font-medium">Criteria:</strong> {scholarship.criteria}</p>
                  <p className="text-sm text-red-600 font-medium mb-4"><Calendar className="inline h-4 w-4 mr-1" /> Deadline: {scholarship.deadline}</p>
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      onClick={() => handleLearnMoreClick(scholarship)}
                      variant="outline"
                      className="flex-1 border-slate-800 text-slate-800 hover:bg-slate-50"
                    >
                      Learn More
                    </Button>
                    <Button 
                      onClick={() => handleApplyClick(scholarship)}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-md"
                    >
                      Apply
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Application <span className="text-gradient">Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these steps to successfully apply for scholarships and awards.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {application_steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || FileText;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg text-center card-hover"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
                    <IconComponent className="h-8 w-8 text-gradient" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={handleGeneralApplyClick}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-md px-8 py-3"
            >
              Access General Application Portal
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <FileText className="h-12 w-12 mx-auto mb-6 text-sky-300" />
            <h2 className="text-3xl font-bold mb-4">Need Assistance?</h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Our Financial Aid office is here to help you navigate the awards and application process. Don't hesitate to reach out with your questions.
            </p>
            <Button asChild size="lg" className="bg-white text-slate-800 hover:bg-slate-50 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/contact">Contact Financial Aid</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AwardsApplication;