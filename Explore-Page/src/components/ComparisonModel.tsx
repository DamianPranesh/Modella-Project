import React from "react";
import { X } from "lucide-react";

type Model = {
  id: string;
  name: string;
  age: number;
  type: string[];
  image: string;
  height: string;
  eyeColor: string;
  bodyType: string;
  skinTone: string;
  gender: string;
  experience: string;
};

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: Model[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  models,
}) => {
  if (!isOpen) return null; // Don't render if not open

  const validModels = models.slice(0, 3);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling on the body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Restore scrolling when component unmounts or modal closes
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
                    src={model.image}
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
                      <span>{model.height}</span>
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
                    <p className="text-gray-700 flex justify-between pb-1">
                      <span className="font-medium">Experience:</span>
                      <span>{model.experience}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
