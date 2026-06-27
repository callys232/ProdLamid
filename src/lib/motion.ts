import { Variants } from "framer-motion";

export const cardHover: Variants = {
    initial: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -3,
        transition: { duration: 0.2 }
    }
};

export const modalPop: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.25 }
    },
    exit: { opacity: 0, scale: 0.95 }
};
