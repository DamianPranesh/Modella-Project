import React from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Globe,
  MapPin,
  Award,
  Calendar,
  Camera,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getCalApi } from "@calcom/embed-react";

type Model = {
  id: string;
  name: string;
  bio: string;
  email: string;
  age: number;
  type: string[];
  image: string[];
  socialUrls: string[];
  height: string;
  eyeColor: string;
  bodyType: string;
  skinTone: string;
  gender: string;
  experience: string;
  location: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
};

interface ModelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model | null;
}

// Custom TikTok icon since it's not in Lucide
const TiktokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  isOpen,
  onClose,
  model,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<
    "portfolio" | "details" | "work"
  >("portfolio");

  // Call useEffect unconditionally so that hooks are always called in the same order.
  React.useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Initialize Cal.com when modal opens
      const initCal = async () => {
        const cal = await getCalApi({ namespace: "15min" });
        cal("ui", {
          cssVarsPerTheme: {
            light: { "cal-brand": "#DD8560" },
            dark: { "cal-brand": "#DD8560" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      };

      initCal();

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // If modal is not open or model is null, do not render anything.
  if (!isOpen || !model) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === model.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? model.image.length - 1 : prev - 1
    );
  };

  // For demonstration, use the model's image as first image and placeholders for rest
  const allImages = model.image;

  const handleBookModel = () => {
    // This will trigger the Cal.com popup
    const button = document.querySelector(
      '[data-cal-namespace="15min"]'
    ) as HTMLElement;
    if (button) {
      button.click();
    } else {
      console.error("Calendar booking button not found");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
      style={{ backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gradient-to-br from-gray-50 to-white w-full max-w-4xl h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col relative border border-gray-200">
        {/* Close button */}
        <div className="absolute top-0 right-0 z-20 p-4">
          <button
            onClick={onClose}
            className="bg-white/90 rounded-full shadow-lg p-2 transition-all duration-300 cursor-pointer hover:bg-white"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Responsive layout container - 2 columns on tablet and up, 1 column on mobile */}
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image carousel section */}
          <div className="w-full md:w-2/5 h-64 sm:h-80 md:h-full relative flex-shrink-0">
            <div className="h-full w-full relative bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-r from-pink-200 to-pink-300/30 blur-2xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-r from-orange-200 to-yellow-200/30 blur-2xl"></div>

              <img
                src={allImages[currentImageIndex]}
                alt={`${model.name} photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                style={{ animation: "fadeIn 0.5s forwards" }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Image navigation */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>

              {/* Image indicator dots */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 transform ${
                      i === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>

              {/* Image count badge */}
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs flex items-center">
                <Camera className="w-3 h-3 mr-1" />
                {currentImageIndex + 1}/{allImages.length}
              </div>

              {/* Model name & location overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 drop-shadow-md">
                  {model.name}
                </h2>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-pink-300" />
                  <p className="opacity-90">{model.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="w-full md:w-3/5 flex flex-col relative overflow-hidden h-full">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-pink-50 blur-3xl opacity-50 -z-10"></div>

            {/* Tabs navigation with cursor-pointer added */}
            <div className="flex border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`flex-1 py-4 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "portfolio"
                    ? "text-[#DD8560] border-b-2 border-[#DD8560]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-4 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "text-[#DD8560] border-b-2 border-[#DD8560]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("work")}
                className={`flex-1 py-4 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === "work"
                    ? "text-[#DD8560] border-b-2 border-[#DD8560]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Work
              </button>
            </div>

            {/* Content area with fixed height and scrollable content */}
            <div className="flex-grow overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* Profile image - centered */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#DD8560] to-pink-700 p-0.5">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                      <img
                        src={model.image[0]}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {activeTab === "portfolio" && (
                  <>
                    {/* Bio section */}
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {model.bio}
                      </p>
                    </div>

                    {/* Social media links */}
                    <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl p-4 mb-6 shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">
                        Find Me Online
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <Instagram className="w-4 h-4 text-pink-600" />
                          <span className="text-gray-700">
                            {model.socialUrls[0]}
                          </span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <TiktokIcon />
                          <span className="text-gray-700">
                            {model.socialUrls[1]}
                          </span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">
                            {model.socialUrls[2]}
                          </span>
                        </a>
                      </div>
                    </div>

                    {/* Quick info cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-xs uppercase text-gray-500 tracking-wider font-medium mb-3">
                          Type
                        </h4>
                        <p className="font-semibold text-gray-900">
                          {model.type.join(", ")}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <h4 className="text-xs uppercase text-gray-500 tracking-wider font-medium mb-3">
                          Experience
                        </h4>
                        <p className="font-semibold text-gray-900">
                          {model.experience}
                        </p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed font-bold">
                        Email: {model.email}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(model.email);
                            toast.success(
                              `email has been copied to clipboard! ✅`,
                              {
                                duration: 2000,
                              }
                            );
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          aria-label="Copy email"
                        >
                          📋
                        </button>
                      </p>
                    </div>
                    <Toaster position="top-center" reverseOrder={false} />
                  </>
                )}

                {activeTab === "details" && (
                  <>
                    {/* Model details */}
                    <div className="mb-6">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
                        Model Details
                      </h3>
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-x sm:divide-y-0 divide-gray-100">
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">Height</p>
                            <p className="font-semibold">{model.height} cm</p>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">Age</p>
                            <p className="font-semibold">{model.age}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-x sm:divide-y-0 divide-gray-100 border-t border-gray-100">
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">
                              Eye Color
                            </p>
                            <p className="font-semibold">{model.eyeColor}</p>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">
                              Body Type
                            </p>
                            <p className="font-semibold">{model.bodyType}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-x sm:divide-y-0 divide-gray-100 border-t border-gray-100">
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">
                              Skin Tone
                            </p>
                            <p className="font-semibold">{model.skinTone}</p>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">Gender</p>
                            <p className="font-semibold">{model.gender}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="mb-6">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
                        Measurements
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-sm text-center">
                          <p className="text-gray-500 text-xs mb-1">Bust</p>
                          <p className="font-semibold text-lg">
                            {model.bust} cm
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-sm text-center">
                          <p className="text-gray-500 text-xs mb-1">Waist</p>
                          <p className="font-semibold text-lg">
                            {model.waist} cm
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-sm text-center">
                          <p className="text-gray-500 text-xs mb-1">Hips</p>
                          <p className="font-semibold text-lg">
                            {model.hips} cm
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-sm text-center">
                          <p className="text-gray-500 text-xs mb-1">Shoes</p>
                          <p className="font-semibold text-lg">
                            {model.shoeSize} EU
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "work" && (
                  <>
                    {/* Recent work section */}
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
                        Recent Work
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: "Paris Fashion Week", date: "March 2025" },
                          {
                            title: "Vogue Italia Editorial",
                            date: "January 2025",
                          },
                          {
                            title: "Summer Campaign - Luxury Brand",
                            date: "December 2024",
                          },
                        ].map((work, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                          >
                            <div className="flex items-center">
                              <Award className="w-5 h-5 text-[#DD8560] mr-3 flex-shrink-0" />
                              <span className="font-medium">{work.title}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm ml-8 sm:ml-0">
                              <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span>{work.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons - Updated to "Book Model" */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-white mt-auto">
              <button
                onClick={handleBookModel}
                className="w-full py-3 bg-[#DD8560] text-white rounded-xl hover:bg-[#DD8560]/90 transition-all duration-300 font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-pink-200/50 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Book Model
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Cal.com button that will be triggered programmatically */}
      <div className="hidden">
        <button
          data-cal-namespace="15min"
          data-cal-link="kevin-d-rymop2/15min"
          data-cal-config='{"layout":"month_view"}'
        >
          Calendar Popup
        </button>
      </div>
    </div>
  );
};

export default ModelDetailModal;
