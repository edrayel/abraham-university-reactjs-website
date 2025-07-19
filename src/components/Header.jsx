import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  LogIn,
  CalendarDays,
  Gift,
  Map,
  Award,
  Users,
  Image as ImageIcon,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 10); // Use <10 for tolerance
    };

    handleScroll(); // Run on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { name: "About", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Admissions", path: "/admissions" },
    { name: "Awards & Application", path: "/awards-application", icon: Award },
    { name: "Campus Life", path: "/campus-life" },
    { name: "Research", path: "/research" },
  ];

  const topNavItems = [
    { name: "Alumni", path: "/alumni", icon: Users },
    { name: "Gallery", path: "/gallery", icon: ImageIcon },
    { name: "Events", path: "/events", icon: CalendarDays },
    { name: "Giving", path: "/giving", icon: Gift },
    { name: "Visit", path: "/visit", icon: Map },
    { name: "Contact", path: "/contact", icon: Phone },
    { name: "Portals", path: "/portals", icon: LogIn },
  ];

  const handleApplyNowClick = () => {
    toast({
      title: "🚧 Apply Now",
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${
          isAtTop
            ? "bg-transparent text-white"
            : "bg-white text-black shadow-sm"
        }`}
    >
      <div className="container mx-auto px-4">
        {/* Top Nav - only visible at top */}
        {isAtTop && (
          <div className="hidden lg:flex justify-end py-2 border-b border-white/20 transition-opacity duration-300">
            <div className="flex flex-wrap items-center space-x-5">
              {topNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className="text-xs font-body font-medium flex items-center space-x-1 hover:text-victorian-gold-bright"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Nav */}
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2"
          >
            <img
              src="/assets/img/abraham-logo.avif"
              alt="Logo"
              className="w-20"
            />
            <div>
              <span className="text-2xl font-bold font-heading">
                Abraham University
              </span>
              <span className="block text-xs font-body font-medium tracking-wider">
                Founded 1874
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-heading font-semibold hover:text-victorian-gold-bright ${
                  location.pathname === item.path
                    ? "text-victorian-gold-bright"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={handleApplyNowClick}
              className="bg-victorian-gold-bright text-black hover:bg-victorian-gold-bright/90"
            >
              Apply Now
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-black/10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-4 py-4 bg-white text-black rounded-lg shadow-xl"
          >
            {[...mainNavItems, ...topNavItems].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center px-4 py-3 font-body font-medium hover:text-victorian-gold-bright ${
                  location.pathname === item.path
                    ? "text-victorian-gold-bright"
                    : ""
                }`}
              >
                {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                {item.name}
              </Link>
            ))}
            <div className="px-4 py-3 mt-2">
              <Button
                onClick={() => {
                  handleApplyNowClick();
                  closeMobileMenu();
                }}
                className="w-full bg-victorian-gold-bright text-black hover:bg-victorian-gold-bright/90"
              >
                Apply Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
