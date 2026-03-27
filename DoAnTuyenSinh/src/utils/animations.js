/**
 * Standardized animation variants — DoAnTuyenSinh
 * Based on p1-UI-SPEC.md animation principles:
 * - Max stagger delay: 50ms per item
 * - Entrance: fade + translateY(8px) only
 * - Hover: scale(1.02) + translateY(-2px) max
 * - Tap: scale(0.97) max
 */

// ============================================================
// ENTRANCE ANIMATIONS
// ============================================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

// ============================================================
// HOVER / TAP ANIMATIONS
// ============================================================

export const hoverLift = {
  whileHover: { y: -2, scale: 1.02 },
  transition: { duration: 0.15 },
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.15 },
};

export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.1 },
};

// ============================================================
// PAGE TRANSITIONS
// ============================================================

export const pageEnter = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

export const pageExit = {
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

// ============================================================
// STAGGER ANIMATIONS
// ============================================================

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

// ============================================================
// MODAL / DIALOG
// ============================================================

export const modalSpring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export const dialogContent = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 8 },
  transition: { type: "spring", stiffness: 500, damping: 30 },
};

// ============================================================
// OVERLAY
// ============================================================

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// ============================================================
// SPRING CONFIGS
// ============================================================

export const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

export const fastSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.5,
};

// ============================================================
// LEGACY VARIANTS (backward compatibility)
// ============================================================

export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const cardHover = {
  hover: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const scaleInLegacy = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ============================================================
// REDUCED MOTION
// ============================================================

export const shouldReduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.001 } },
};

export const getAnimationVariants = (normalVariants, reducedVariants = reducedMotionVariants) => {
  return shouldReduceMotion() ? reducedVariants : normalVariants;
};
