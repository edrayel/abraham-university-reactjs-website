import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useUniversityStore from "@/stores/homeStore";

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

  const handleApplyClick = () => {
    // Use CTA link from hero data if available, otherwise show toast
    if (hero?.cta_link) {
      window.open(hero.cta_link, "_blank");
    } else {
      toast({
        title: "🚧 Application Portal",
        description:
          "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      });
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
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black text-white pt-[80px]">
      <div className="absolute inset-0 opacity-20">
        <img
          src={backgroundImage}
          alt="University campus aerial view"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to default image if background_image fails to load
            e.target.src =
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";
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
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight font-libreBaskerville">
            {heroTitle}
            <span className="block text-gold">{heroSubtitle}</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-primary-foreground/90 leading-relaxed font-light">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleApplyClick}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-10 py-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-10 py-6 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/about">Learn More</Link>
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
