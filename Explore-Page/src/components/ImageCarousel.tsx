import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import your SVG images
import image1 from "../images/Image-1.svg";
import image2 from "../images/Image-2.svg";
import image3 from "../images/Image-3.svg";
import image4 from "../images/Image-4.svg";
import image5 from "../images/Image-5.svg";

// Array of imported SVG images
const images = [image1, image2, image3, image4, image5];

export function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Use the SVG as an image source */}
          <img
            src={images[activeIndex] || "/placeholder.svg"}
            alt={`Slide ${activeIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
        <button
          onClick={() =>
            setActiveIndex((prev) =>
              prev === 0 ? images.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() =>
            setActiveIndex((prev) =>
              prev === images.length - 1 ? 0 : prev + 1
            )
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
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
