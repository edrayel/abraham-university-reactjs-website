import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, FileText, CheckSquare, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const scholarshipData = [
  {
    title: 'Presidential Scholarship',
    amount: '$20,000 per year',
    criteria: 'Exceptional academic achievement (GPA 3.9+), leadership, and community service.',
    deadline: 'January 15, 2026',
    imageQuery: 'academic-excellence-award',
  },
  {
    title: 'Dean\'s Merit Award',
    amount: '$10,000 per year',
    criteria: 'Strong academic record (GPA 3.7+), extracurricular involvement.',
    deadline: 'February 1, 2026',
    imageQuery: 'leadership-award',
  },
  {
    title: 'STEM Innovators Grant',
    amount: '$15,000 (one-time)',
    criteria: 'Declared major in STEM field, innovative project proposal.',
    deadline: 'March 1, 2026',
    imageQuery: 'science-technology-award',
  },
  {
    title: 'Creative Arts Fellowship',
    amount: '$12,000 per year',
    criteria: 'Outstanding talent in visual or performing arts, portfolio submission required.',
    deadline: 'February 15, 2026',
    imageQuery: 'artistic-achievement-award',
  },
];

const applicationSteps = [
  {
    icon: FileText,
    title: 'Review Eligibility',
    description: 'Carefully read the criteria for each award to ensure you qualify.',
  },
  {
    icon: CheckSquare,
    title: 'Prepare Documents',
    description: 'Gather transcripts, recommendation letters, essays, and portfolios as required.',
  },
  {
    icon: Calendar,
    title: 'Note Deadlines',
    description: 'Submit your application and all supporting materials by the specified deadline.',
  },
  {
    icon: Users,
    title: 'Seek Recommendations',
    description: 'Request letters of recommendation well in advance from teachers or mentors.',
  },
];

const AwardsApplication = () => {
  const handleApplyClick = (awardTitle) => {
    toast({
      title: `🚧 Apply for ${awardTitle}`,
      description: "The application portal for this award isn't implemented yet. Please check back later or contact the financial aid office. 🚀",
    });
  };

  const handleGeneralApplyClick = () => {
    toast({
      title: "🚧 General Application Portal",
      description: "The general scholarship application portal isn't implemented yet. 🚀",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <Award className="h-16 w-16 mx-auto mb-6 text-sky-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Awards & Scholarships</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Discover various scholarship and award opportunities available to support your academic journey at Abraham University.
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
            {scholarshipData.map((scholarship, index) => (
              <motion.div
                key={scholarship.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden card-hover group flex flex-col"
              >
                <div className="h-56 relative overflow-hidden">
                  <img-replace src={`https://source.unsplash.com/random/600x400/?${scholarship.imageQuery}`} alt={`${scholarship.title} visual representation`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-2xl font-semibold text-white mb-1">{scholarship.title}</h3>
                    <p className="text-lg font-medium text-sky-300">{scholarship.amount}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-700 mb-2"><strong className="font-medium">Criteria:</strong> {scholarship.criteria}</p>
                  <p className="text-sm text-red-600 font-medium mb-4"><Calendar className="inline h-4 w-4 mr-1" /> Deadline: {scholarship.deadline}</p>
                  <Button 
                    onClick={() => handleApplyClick(scholarship.title)}
                    className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Learn More & Apply
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
            {applicationSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center card-hover"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <step.icon className="h-8 w-8 text-gradient" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={handleGeneralApplyClick}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-8 py-3"
            >
              Access General Application Portal
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <FileText className="h-12 w-12 mx-auto mb-6 text-sky-300" />
            <h2 className="text-3xl font-bold mb-4">Need Assistance?</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our Financial Aid office is here to help you navigate the awards and application process. Don't hesitate to reach out with your questions.
            </p>
            <Button asChild size="lg" className="bg-white text-gradient hover:bg-blue-50 font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/contact">Contact Financial Aid</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AwardsApplication;