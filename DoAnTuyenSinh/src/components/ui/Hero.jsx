import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Hero = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  background = "gradient",
  ...props 
}, ref) => {
  const baseClasses = "relative overflow-hidden";
  
  const variants = {
    default: "py-20 lg:py-32",
    compact: "py-16 lg:py-24",
    full: "min-h-screen flex items-center"
  };

  const backgrounds = {
    gradient: "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
    solid: "bg-white",
    dark: "bg-gray-900 text-white",
    primary: "bg-blue-600 text-white"
  };

  return (
    <motion.section
      ref={ref}
      className={cn(baseClasses, variants[variant], backgrounds[background], className)}
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
});

Hero.displayName = "Hero";

const HeroContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}
    {...props}
  />
));

HeroContent.displayName = "HeroContent";

const HeroTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.h1
    ref={ref}
    className={cn(
      "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6",
      className
    )}
    variants={itemVariants}
    {...props}
  >
    {children}
  </motion.h1>
));

HeroTitle.displayName = "HeroTitle";

const HeroSubtitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.p
    ref={ref}
    className={cn(
      "text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl",
      className
    )}
    variants={itemVariants}
    {...props}
  >
    {children}
  </motion.p>
));

HeroSubtitle.displayName = "HeroSubtitle";

const HeroActions = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn("flex flex-col sm:flex-row gap-4", className)}
    variants={itemVariants}
    {...props}
  />
));

HeroActions.displayName = "HeroActions";

export { Hero, HeroContent, HeroTitle, HeroSubtitle, HeroActions }; 