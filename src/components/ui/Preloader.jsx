import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hasUserVisited, markAsVisited } from '@/utils/preloaderUtils';

/**
 * Preloader component that displays the university logo with elegant animations
 * Shows on first-time page load and stores visit status in localStorage
 * @param {Object} props - Component props
 * @param {Function} props.onComplete - Callback function when preloader animation completes
 */
const Preloader = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('loading'); // 'loading', 'complete', 'exit'

  useEffect(() => {
    // Check if user has visited before
    if (hasUserVisited()) {
      // Skip preloader for returning visitors
      setIsVisible(false);
      onComplete?.();
      return;
    }

    // Animation sequence for first-time visitors
    const timer1 = setTimeout(() => {
      setAnimationPhase('complete');
    }, 2500); // Logo animation duration

    const timer2 = setTimeout(() => {
      setAnimationPhase('exit');
    }, 3200); // Hold complete state briefly

    const timer3 = setTimeout(() => {
      setIsVisible(false);
      markAsVisited();
      onComplete?.();
    }, 3800); // Exit animation duration

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative flex flex-col items-center justify-center space-y-8">
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
            animate={{ 
              scale: animationPhase === 'loading' ? 1 : 1.1,
              opacity: 1,
              rotateY: 0
            }}
            transition={{ 
              duration: 1.2, 
              ease: 'easeOut',
              scale: { delay: 0.2 },
              opacity: { delay: 0.1 }
            }}
            className="relative"
          >
            {/* Glow Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: animationPhase === 'loading' ? [0, 0.6, 0] : 0.8,
                scale: animationPhase === 'loading' ? [0.8, 1.2, 1] : 1.1
              }}
              transition={{ 
                duration: 2,
                repeat: animationPhase === 'loading' ? Infinity : 0,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-victorian-gold-bright/30 elegant-rounded-full blur-xl"
            />
            
            {/* Logo Image */}
            <motion.img
              src="/assets/img/abraham-logo.avif"
              alt="Abraham University Logo"
              className="w-32 h-32 md:w-40 md:h-40 relative z-10 drop-shadow-2xl"
              initial={{ filter: 'brightness(0.7)' }}
              animate={{ 
                filter: animationPhase === 'complete' ? 'brightness(1.1)' : 'brightness(0.9)'
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* University Name */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            className="text-center space-y-2"
          >
            <motion.h1
              initial={{ letterSpacing: '0.1em' }}
              animate={{ 
                letterSpacing: animationPhase === 'complete' ? '0.05em' : '0.1em'
              }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-minimalist-white"
            >
              Abraham University
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-sm md:text-base font-body font-medium tracking-wider text-minimalist-gray"
            >
              Founded 1874
            </motion.p>
          </motion.div>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animationPhase === 'loading' ? 1 : 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            {/* Elegant Loading Dots */}
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
                className="w-2 h-2 bg-victorian-gold-bright elegant-rounded-full"
              />
            ))}
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: animationPhase === 'complete' ? 0 : 20,
              opacity: animationPhase === 'complete' ? 1 : 0
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <p className="text-lg md:text-xl font-body text-minimalist-white/90">
              Welcome to Excellence
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="absolute top-20 left-20 w-32 h-32 border border-minimalist-white/20 elegant-rounded-full"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 1.3, duration: 1.5 }}
          className="absolute bottom-20 right-20 w-24 h-24 border border-victorian-gold-bright/30 elegant-rounded-full"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;