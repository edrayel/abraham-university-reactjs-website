import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useUniversityStore from "@/store/universityStore";

const HeroSection = () => {
  const handleApplyClick = () => {
    toast({
      title: "🚧 Application Portal",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const heroSlides = useUniversityStore((state) => state.heroSlides);

  if (isLoadingAll) return <div>Loading...</div>;
  if (generalError) return <div>Error: {generalError}</div>;

  return (
    <div>
      {heroSlides.map((slide, index) => (
        <div key={index}>{slide.title}</div> // Assuming slide has a title
      ))}
    </div>
  );

  // return (
  //   <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-800 via-blue-600 to-sky-500 text-white overflow-hidden pt-20">
  //     <div className="absolute inset-0 opacity-20">
  //       <img-replace src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" alt="University campus aerial view" className="w-full h-full object-cover" />
  //     </div>
  //     <div className="container mx-auto px-4 relative z-10">
  //       <motion.div
  //         initial={{ opacity: 0, y: 50 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.8 }}
  //         className="text-center max-w-4xl mx-auto"
  //       >
  //         <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
  //           Empowering Minds,
  //           <span className="block text-sky-300">
  //             Shaping Futures.
  //           </span>
  //         </h1>
  //         <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed font-light">
  //           Join Abraham University and embark on a transformative educational journey that will prepare you for tomorrow's challenges.
  //         </p>
  //         <div className="flex flex-col sm:flex-row gap-4 justify-center">
  //           <Button
  //             size="lg"
  //             onClick={handleApplyClick}
  //             className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-10 py-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
  //           >
  //             Apply Now
  //             <ArrowRight className="ml-2 h-5 w-5" />
  //           </Button>
  //           <Button
  //             size="lg"
  //             variant="outline"
  //             asChild
  //             className="border-white text-white hover:bg-white hover:text-blue-700 text-lg px-10 py-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
  //           >
  //             <Link to="/about">Learn More</Link>
  //           </Button>
  //         </div>
  //       </motion.div>
  //     </div>
  //     <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
  //       <div className="w-8 h-12 border-2 border-sky-300 rounded-full flex justify-center items-center p-1">
  //         <div className="w-1 h-3 bg-sky-300 rounded-full animate-pulse"></div>
  //       </div>
  //     </div>
  //   </section>
  // );
};

export default HeroSection;
