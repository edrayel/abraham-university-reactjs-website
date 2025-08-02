import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const handleApplyClick = () => {
    toast({
      title: "🚧 Application Portal",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-800 via-blue-600 to-sky-500 text-white overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-20">
        <img-replace
          src="https://wp.abrahamuniversity.us/wp-content/uploads/2025/08/kd5cxwzok4.jpg"
          alt="University campus aerial view"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Empowering Minds,
            <span className="block text-sky-300">Shaping Futures.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed font-light">
            Join Abraham University and embark on a transformative educational
            journey that will prepare you for tomorrow's challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleApplyClick}
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-blue-700 text-lg px-10 py-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-8 h-12 border-2 border-sky-300 rounded-full flex justify-center items-center p-1">
          <div className="w-1 h-3 bg-sky-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;