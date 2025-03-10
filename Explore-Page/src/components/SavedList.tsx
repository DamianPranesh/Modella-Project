"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import model1 from "../images/Image-8.png";
import model2 from "../images/Image-9.png";
import model3 from "../images/Image-10.png";
import model4 from "../images/Image-11.png";
import model5 from "../images/Image-12.png";
import model6 from "../images/Image-13.png";
import model7 from "../images/Image-14.png";
import model8 from "../images/Image-15.png";
import ComparisonModal from "./ComparisonModel";
import ModelDetailModal from "./ModelDetailModal";

// Define the Model type
type Model = {
  id: string;
  name: string;
  age: number;
  type: string;
  image: string;
  height: string;
  eyeColor: string;
  bodyType: string;
  skinTone: string;
  gender: string;
  experience: string;
};

// List of saved models
const savedModels: Model[] = [
  {
    id: "1",
    name: "CURTLY",
    age: 21,
    type: "EDITORIAL AND COMMERCIAL MODEL",
    image: model1,
    height: "6'1\"",
    eyeColor: "Brown",
    bodyType: "Athletic",
    skinTone: "Medium",
    gender: "Male",
    experience: "3 years",
  },
  {
    id: "2",
    name: "MIA",
    age: 21,
    type: "RUNWAY MODEL",
    image: model2,
    height: "5'11\"",
    eyeColor: "Blue",
    bodyType: "Slim",
    skinTone: "Fair",
    gender: "Female",
    experience: "2 years",
  },
  {
    id: "3",
    name: "EMMA",
    age: 23,
    type: "BEAUTY MODEL",
    image: model3,
    height: "5'9\"",
    eyeColor: "Green",
    bodyType: "Hourglass",
    skinTone: "Medium",
    gender: "Female",
    experience: "4 years",
  },
  {
    id: "4",
    name: "NOAH",
    age: 20,
    type: "COMMERCIAL MODEL",
    image: model4,
    height: "6'0\"",
    eyeColor: "Hazel",
    bodyType: "Athletic",
    skinTone: "Olive",
    gender: "Male",
    experience: "1 year",
  },
  {
    id: "5",
    name: "ZOE",
    age: 22,
    type: "COMMERCIAL MODEL",
    image: model5,
    height: "5'8\"",
    eyeColor: "Brown",
    bodyType: "Petite",
    skinTone: "Tan",
    gender: "Female",
    experience: "3 years",
  },
  {
    id: "6",
    name: "LILY",
    age: 19,
    type: "EDITORIAL MODEL",
    image: model6,
    height: "5'10\"",
    eyeColor: "Blue",
    bodyType: "Slim",
    skinTone: "Fair",
    gender: "Female",
    experience: "1 year",
  },
  {
    id: "7",
    name: "LIAM",
    age: 23,
    type: "LIFESTYLE MODEL",
    image: model7,
    height: "6'2\"",
    eyeColor: "Brown",
    bodyType: "Muscular",
    skinTone: "Deep",
    gender: "Male",
    experience: "5 years",
  },
  {
    id: "8",
    name: "GIA",
    age: 21,
    type: "RUNWAY MODEL",
    image: model8,
    height: "5'11\"",
    eyeColor: "Amber",
    bodyType: "Slim",
    skinTone: "Medium",
    gender: "Female",
    experience: "2 years",
  },
];

// Define the SavedList component
export function SavedList({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  // State variables
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isSelectionActive, setIsSelectionActive] = useState<boolean>(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState<boolean>(false);
  const [comparisonModalOpen, setComparisonModalOpen] =
    useState<boolean>(false);
  const [tooManyModelsModalOpen, setTooManyModelsModalOpen] =
    useState<boolean>(false);
  const [modelDetailModalOpen, setModelDetailModalOpen] =
    useState<boolean>(false);
  const [selectedModelForDetail, setSelectedModelForDetail] =
    useState<Model | null>(null);

  // Prevent background scrolling when any modal is open
  useEffect(() => {
    if (comparisonModalOpen || tooManyModelsModalOpen || modelDetailModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [comparisonModalOpen, tooManyModelsModalOpen, modelDetailModalOpen]);

  // Toggle model selection
  const toggleModelSelection = (modelId: string) => {
    if (isSelectionActive) {
      if (selectedModels.includes(modelId)) {
        setSelectedModels((prev) => prev.filter((id) => id !== modelId));
      } else if (selectedModels.length < 3) {
        setSelectedModels((prev) => [...prev, modelId]);
      } else {
        setTooManyModelsModalOpen(true);
      }
    }
  };

  // Handle compare button click
  const handleCompareClick = () => {
    if (showConfirmButtons) {
      setIsSelectionActive(false);
      setShowConfirmButtons(false);
      setSelectedModels([]);
    } else {
      setIsSelectionActive(true);
      setShowConfirmButtons(true);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    setIsSelectionActive(false);
    setShowConfirmButtons(false);
    setSelectedModels([]);
  };

  // Handle OK button click
  const handleOk = () => {
    setComparisonModalOpen(true);
  };

  // Close comparison modal
  const closeComparisonModal = () => {
    setComparisonModalOpen(false);
  };

  // Close too many models modal
  const closeTooManyModelsModal = () => {
    setTooManyModelsModalOpen(false);
  };

  // Handle model click
  const handleModelClick = (model: Model) => {
    if (isSelectionActive) {
      toggleModelSelection(model.id);
    } else {
      setSelectedModelForDetail(model);
      setModelDetailModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hamburger Menu and Compare Button */}
      <div className="flex justify-between items-center mb-8">
        <button
          className="md:hidden mb-4 cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu
            className={`w-6 h-6 ${
              isSidebarOpen ? "text-white" : "text-[#DD8560]"
            }`}
          />
        </button>
        <div className="flex items-center ml-auto">
          <button
            className="px-6 py-2 rounded-full border border-[#DD8560] text-[#DD8560] hover:bg-[#DD8560] hover:text-white transition-colors cursor-pointer"
            onClick={handleCompareClick}
            style={{ marginTop: "-8px" }}
          >
            Compare
          </button>
          {showConfirmButtons && (
            <div className="flex ml-2">
              <button
                className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors mr-2 cursor-pointer"
                onClick={handleCancel}
                style={{ marginTop: "-8px" }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                onClick={handleOk}
                style={{ marginTop: "-8px" }}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid layout for saved models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {savedModels.map((model) => (
          <div
            key={model.id}
            className={`group relative cursor-pointer transition-transform duration-300 hover:scale-[1.02]`}
            onClick={() => handleModelClick(model)}
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
              <img
                src={model.image || "/placeholder.svg"}
                alt={model.name}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                  isSelectionActive && selectedModels.includes(model.id)
                    ? "brightness-90"
                    : ""
                }`}
              />
              {isSelectionActive && (
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    selectedModels.includes(model.id)
                      ? "bg-[#DD8560] border-[#DD8560] scale-110"
                      : "bg-white/80 border-gray-400"
                  }`}
                >
                  {selectedModels.includes(model.id) && (
                    <span className="text-white flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">NAME: {model.name}</p>
                <p>AGE: {model.age}</p>
              </div>
              <p className="text-sm text-gray-600">TYPE: {model.type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={closeComparisonModal}
        models={savedModels.filter((model) =>
          selectedModels.includes(model.id)
        )}
      />

      {/* Too Many Models Modal */}
      {tooManyModelsModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 text-center relative">
            <button
              onClick={closeTooManyModelsModal}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-bold mb-4">Too Many Models</h2>
            <p className="text-gray-600">
              Please select no more than 3 models for comparison.
            </p>
          </div>
        </div>
      )}

      {/* Model Detail Modal */}
      {modelDetailModalOpen && selectedModelForDetail && (
        <ModelDetailModal
          isOpen={modelDetailModalOpen}
          onClose={() => {
            setModelDetailModalOpen(false);
            setSelectedModelForDetail(null);
          }}
          model={selectedModelForDetail}
        />
      )}
    </div>
  );
}

export default SavedList;
