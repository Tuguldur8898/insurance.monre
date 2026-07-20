import type { Variants, Transition } from "framer-motion";

export const transitions = {
  default: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as Transition,
  slow: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } as Transition,
  page: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } as Transition,
  springGentle: { type: "spring", stiffness: 120, damping: 20 } as Transition,
  springSnappy: { type: "spring", stiffness: 400, damping: 30 } as Transition,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const cardHover: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.005, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
};

export const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
