"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import model1 from "../images-mod/1.jpg";
import model2 from "../images-mod/2.jpg";
import model3 from "../images-mod/3.jpg";
import model4 from "../images-mod/4.jpg";
import model5 from "../images-mod/5.jpg";
import ComparisonModal from "./ComparisonModel";
import ModelDetailModal from "./ModelDetailModal";

type Model = {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  type: string;
  image: string;
  minHeight: string;
  maxHeight: string;
  eyeColor: string;
  bodyType: string;
  skinTone: string;
  gender: string;
};

const savedModels: Model[] = [
  {
    id: "1",
    name: "Carnage",
    minAge: 18,
    maxAge: 25,
    type: "FITNESS MODEL",
    image: model1,
    minHeight: "5'11\"",
    maxHeight: "6'3\"",
    eyeColor: "Brown",
    bodyType: "Athletic",
    skinTone: "Medium",
    gender: "Male",
  },
  {
    id: "2",
    name: "AT Studios",
    minAge: 18,
    maxAge: 25,
    type: "COMMERCIAL MODEL",
    image: model2,
    minHeight: "5'9\"",
    maxHeight: "6'1\"",
    eyeColor: "Blue",
    bodyType: "Slim",
    skinTone: "Fair",
    gender: "Female",
  },
  {
    id: "3",
    name: "Mimosa",
    minAge: 18,
    maxAge: 25,
    type: "PETTITE MODEL",
    image: model3,
    minHeight: "5'7\"",
    maxHeight: "5'11\"",
    eyeColor: "Green",
    bodyType: "Hourglass",
    skinTone: "Medium",
    gender: "Female",
  },
  {
    id: "4",
    name: "CS16",
    minAge: 18,
    maxAge: 25,
    type: "EDITORIAL MODEL",
    image: model4,
    minHeight: "5'10\"",
    maxHeight: "6'2\"",
    eyeColor: "Hazel",
    bodyType: "Athletic",
    skinTone: "Olive",
    gender: "Male",
  },
  {
    id: "5",
    name: "Travlon",
    minAge: 18,
    maxAge: 25,
    type: "SWIMWEAR MODEL",
    image: model5,
    minHeight: "5'6\"",
    maxHeight: "5'10\"",
    eyeColor: "Brown",
    bodyType: "Petite",
    skinTone: "Tan",
    gender: "Female",
  }
];

export function SavedList({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
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

  const handleCancel = () => {
    setIsSelectionActive(false);
    setShowConfirmButtons(false);
    setSelectedModels([]);
  };

  const handleOk = () => {
    setComparisonModalOpen(true);
  };

  const closeComparisonModal = () => {
    setComparisonModalOpen(false);
  };

  const closeTooManyModelsModal = () => {
    setTooManyModelsModalOpen(false);
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
            className="group relative cursor-pointer"
            onClick={() => {
              if (!isSelectionActive) {
                setSelectedModelForDetail(model);
                setModelDetailModalOpen(true);
              }
            }}
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
              <img
                src={model.image || "/placeholder.svg"}
                alt={model.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">NAME: {model.name}</p>
                <p>AGE: {model.minAge} - {model.maxAge}</p>
              </div>
              <p className="text-sm text-gray-600">TYPE: {model.type}</p>
            </div>
            {isSelectionActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModelSelection(model.id);
                }}
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 cursor-pointer ${
                  selectedModels.includes(model.id)
                    ? "bg-[#DD8560] border-[#DD8560]"
                    : "bg-white/80 border-gray-400"
                }`}
                aria-label={`Select ${model.name} for comparison`}
              >
                {selectedModels.includes(model.id) && (
                  <span className="text-white flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            )}
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
