import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useUniversityStore from "@/stores/homeStore";
import { useState, useRef } from "react";

// Temporary mock data - replace with actual store when files are created
// const mockHero = {
//   title: "Engineer Edward University ",
//   subtitle: "Shaping Futures.",
//   description:
//     "Join Abraham University and embark on a transformative educational journey that will prepare you for tomorrow's challenges.",
//   cta_text: "Apply Now",
//   cta_link: "https://abrahamuniversity.org",
//   background_image: "",
// };

const HeroSection = () => {
  // Get hero data from Zustand store
  // Temporary: Use mock data until store is properly set up
  const { hero, isLoading, error } = useUniversityStore();
  // const hero = mockHero;
  // const isLoading = false;
  // const error = null;

  // Mouse tracking state for gradient effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const titleRef = useRef(null);

  const handleApplyClick = () => {
    // Use CTA link from hero data if available, otherwise show toast
    if (hero?.cta_link) {
      window.open(hero.cta_link, "_blank");
    } else {
      toast({
        title: "🚧 Application Portal",
        description:
          "This feature isn't implemented yet—but don't worry! You can request it in your next prompt!!! 🚀",
      });
    }
  };

  // Handle mouse movement for gradient effect
  const handleMouseMove = (e) => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary text-white overflow-hidden pt-[80px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-white mx-auto"></div>
          <p className="mt-4 text-xl">Loading...</p>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-red-800 via-red-600 to-red-500 text-white overflow-hidden pt-[80px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Error Loading Content</h2>
          <p className="text-xl">{error}</p>
        </div>
      </section>
    );
  }

  // Fallback values if hero data is not available
  const heroTitle = hero?.title || "Empowering Minds,";
  const heroSubtitle = hero?.subtitle || "Shaping Futures.";
  const heroDescription =
    hero?.description ||
    "Join Abraham University and embark on a transformative educational journey that will prepare you for tomorrow's challenges.";
  const ctaText = hero?.cta_text || "Apply Now";
  const ctaLink = hero?.cta_link || "";
  const backgroundImage =
    hero?.background_image ||
    "/campus-hero-placeholder.svg";

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black text-white pt-[80px]">
      <div className="absolute inset-0 opacity-20">
        <img
          src={backgroundImage}
          alt="University campus aerial view"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to local placeholder if background_image fails to load
            e.target.src = "/campus-hero-placeholder.svg";
          }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 
            ref={titleRef}
            onMouseMove={handleMouseMove}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight font-libreBaskerville cursor-pointer"
          >
            {heroTitle}
            <span 
              className="block animated-gradient-text"
              style={{
                backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                  #ffef94 0%, 
                  #ffd700 25%, 
                  #daa520 50%, 
                  #b8860b 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                transition: 'background-image 0.3s ease',
                filter: `drop-shadow(0 0 8px rgba(255, 215, 0, ${Math.max(0.3, 1 - Math.sqrt((mousePosition.x - 50) ** 2 + (mousePosition.y - 50) ** 2) / 100)}))`
              }}
            >
              {heroSubtitle}
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-primary-foreground/90 leading-relaxed font-light">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleApplyClick}
              className="border border-white/60 bg-transparent text-white/60 hover:bg-white hover:text-black text-base px-6 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              asChild
              className="border border-white/60 bg-transparent text-white/60 hover:bg-white hover:text-black text-base px-6 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/about" className="flex items-center justify-center">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-8 h-12 border-2 border-gold rounded-full flex justify-center items-center p-1">
          <div className="w-1 h-3 bg-gold rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
