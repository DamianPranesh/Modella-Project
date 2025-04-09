import React from "react";
import { X } from "lucide-react";
import { getCalApi } from "@calcom/embed-react";
import toast, { Toaster } from "react-hot-toast";

type ComparisonModel = {
  id: string;
  name: string;
  bio: string;
  email: string; // Added email property
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

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ComparisonModel[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  models,
}) => {
  // Call useEffect unconditionally.
  React.useEffect(() => {
    if (isOpen) {
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
      console.log("Comparison modal is open");
    }
  }, [isOpen]);

  const handleBookModel = (modelId: string) => {
    // This will trigger the Cal.com popup
    const button = document.querySelector(
      `[data-cal-namespace="15min"][data-model-id="${modelId}"]`
    ) as HTMLElement;
    if (button) {
      button.click();
    } else {
      console.error("Calendar booking button not found for model:", modelId);
    }
  };

  if (!isOpen) return null;

  const validModels = models.slice(0, 3);

  if (validModels.length < 2) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h2 className="text-xl font-bold mb-4">Insufficient Models</h2>
          <p className="text-gray-600">
            Please select at least 2 models for comparison.
          </p>
        </div>
      </div>
    );
  }

  // Determine the maximum width based on number of models
  const getMaxWidthClass = () => {
    switch (validModels.length) {
      case 2:
        return "max-w-3xl"; // Smaller max width for 2 models
      case 3:
        return "max-w-5xl"; // Larger max width for 3 models
      default:
        return "max-w-3xl";
    }
  };

  // Determine the grid columns based on number of models
  const getGridClass = () => {
    switch (validModels.length) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2"; // 2 columns for 2 models
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"; // 3 columns for 3 models
      default:
        return "grid-cols-1 sm:grid-cols-2";
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Modal container with padding to ensure it doesn't touch edges */}
      <div className="flex items-center justify-center px-6 md:px-12 lg:px-20 py-10 md:py-16 h-full">
        {/* Modal content with dynamic width based on model count */}
        <div
          className={`bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full ${getMaxWidthClass()} mx-auto max-h-[90vh] overflow-y-auto relative`}
        >
          {/* X close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 z-10 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#DD8560] pr-8">
            Comparison Chart
          </h2>

          <div className={`grid ${getGridClass()} gap-4 md:gap-8`}>
            {validModels.map((model) => (
              <div
                key={model.id}
                className="border-2 border-[#DD8560] rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl bg-gray-50"
              >
                <div className="aspect-[3/4] w-full">
                  <img
                    src={model.image[0]}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6 text-center">
                  <h3 className="text-xl font-semibold text-[#DD8560]">
                    {model.name}
                  </h3>
                  <div className="grid grid-cols-1 gap-2 mt-3 text-sm">
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Age:</span>
                      <span>{model.age}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Type:</span>
                      <span>{model.type.join(", ")}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Height:</span>
                      <span>{model.height} cm</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Gender:</span>
                      <span>{model.gender}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Eye Color:</span>
                      <span>{model.eyeColor}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Body Type:</span>
                      <span>{model.bodyType}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Skin Tone:</span>
                      <span>{model.skinTone}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-gray-200 pb-1">
                      <span className="font-medium">Experience:</span>
                      <span>{model.experience}</span>
                    </p>
                  </div>

                  {/* Email with Copy Button */}
                  <div className="mt-4 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-medium flex items-center justify-between">
                      <span className="text-sm">Email:</span>
                      <span className="text-sm truncate max-w-[150px]">{model.email}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(model.email);
                          toast.success(`${model.name}'s email copied to clipboard! ✅`, {
                            duration: 2000,
                          });
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Copy email"
                      >
                        📋
                      </button>
                    </p>
                  </div>
                  
                  {/* Book Model Button */}
                  <button
                    onClick={() => handleBookModel(model.id)}
                    className="w-full py-3 bg-[#DD8560] text-white rounded-xl hover:bg-[#DD8560]/90 transition-all duration-300 font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-pink-200/50 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Book Model
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Cal.com buttons for each model */}
      <div className="hidden">
        {validModels.map((model) => (
          <button
            key={model.id}
            data-cal-namespace="15min"
            data-cal-link="kevin-d-rymop2/15min"
            data-cal-config='{"layout":"month_view"}'
            data-model-id={model.id}
          >
            Calendar Popup for {model.name}
          </button>
        ))}
      </div>
      
      {/* Toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ComparisonModal;