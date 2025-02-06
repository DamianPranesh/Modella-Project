"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import your images
import image1 from "../images/Image-1.svg";
import image2 from "../images/Image-2.svg";
import image3 from "../images/Image-3.svg";
import image4 from "../images/Image-4.svg";
import image5 from "../images/Image-5.svg";

const images = [image1, image2, image3, image4, image5];

export function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Add autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1); // Move to next slide
    }, 8000); // 8 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [activeIndex]); // Reset interval when activeIndex changes

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      scale: 0.8,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      scale: 0.8,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex(
      (prevIndex) => (prevIndex + newDirection + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 overflow-hidden">
      <div className="relative aspect-[16/9] rounded-[30px] overflow-hidden">
        {/* Main Carousel */}
        <div className="relative w-full h-full px-32">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-[80%] h-full left-1/2 -translate-x-1/2 scale-85"
            >
              <img
                src={images[activeIndex] || "/placeholder.svg"}
                alt={`Slide ${activeIndex + 1}`}
                className="w-full h-full object-cover rounded-[30px]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Side Images */}
          <div className="absolute top-1/2 -left-8 w-1/3 aspect-[16/9] -translate-y-1/2 opacity-50 scale-120 rounded-[30px] overflow-hidden">
            <img
              src={
                images[(activeIndex - 1 + images.length) % images.length] ||
                "/placeholder.svg"
              }
              alt="Previous"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-1/2 -right-8 w-1/3 aspect-[16/9] -translate-y-1/2 opacity-50 scale-120 rounded-[30px] overflow-hidden">
            <img
              src={
                images[(activeIndex + 1) % images.length] || "/placeholder.svg"
              }
              alt="Next"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-[#7B61FF]" : "bg-[#D9D9D9]"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
