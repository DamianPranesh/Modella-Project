"use client";

import { useState } from "react";
import model1 from "../images/Image-8.png";
import model2 from "../images/Image-9.png";
import model3 from "../images/Image-10.png";
import model4 from "../images/Image-11.png";
import model5 from "../images/Image-12.png";
import model6 from "../images/Image-13.png";
import model7 from "../images/Image-14.png";
import model8 from "../images/Image-15.png";
import { Menu } from "lucide-react";

type Model = {
  id: string;
  name: string;
  age: number;
  type: string;
  image: string;
};

const savedModels: Model[] = [
  {
    id: "1",
    name: "CURTLY",
    age: 21,
    type: "EDITORIAL AND COMMERCIAL MODEL",
    image: model1,
  },
  {
    id: "2",
    name: "MIA",
    age: 21,
    type: "RUNWAY MODEL",
    image: model2,
  },
  {
    id: "3",
    name: "EMMA",
    age: 23,
    type: "BEAUTY MODEL",
    image: model3,
  },
  {
    id: "4",
    name: "NOAH",
    age: 20,
    type: "COMMERCIAL MODEL",
    image: model4,
  },
  {
    id: "5",
    name: "ZOE",
    age: 22,
    type: "COMMERCIAL MODEL",
    image: model5,
  },
  {
    id: "6",
    name: "LILY",
    age: 19,
    type: "EDITORIAL MODEL",
    image: model6,
  },
  {
    id: "7",
    name: "LIAM",
    age: 23,
    type: "LIFESTYLE MODEL",
    image: model7,
  },
  {
    id: "8",
    name: "GIA",
    age: 21,
    type: "RUNWAY MODEL",
    image: model8,
  },
];

export function SavedList({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void; // Function to toggle sidebar visibility
  isSidebarOpen: boolean; // State indicating if the sidebar is open
}) {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isSelectionActive, setIsSelectionActive] = useState<boolean>(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState<boolean>(false);

  const toggleModelSelection = (modelId: string) => {
    if (isSelectionActive) {
      setSelectedModels((prev) =>
        prev.includes(modelId)
          ? prev.filter((id) => id !== modelId)
          : [...prev, modelId]
      );
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
    console.log("OK clicked with selected models:", selectedModels);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Container for Hamburger Menu and Compare Button */}
      <div className="flex justify-between items-center mb-8">
        {/* Hamburger Menu for Mobile */}
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

        {/* Container for Compare Button and Confirm Buttons */}
        <div className="flex items-center ml-auto">
          {/* Compare Button */}
          <button
            className="px-6 py-2 rounded-full border border-[#DD8560] text-[#DD8560] hover:bg-[#DD8560] hover:text-white transition-colors"
            onClick={handleCompareClick}
            style={{ marginTop: "-8px" }}
          >
            Compare
          </button>

          {/* Show Cancel and OK buttons if selection is active */}
          {showConfirmButtons && (
            <div className="flex ml-2">
              <button
                className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                onClick={handleOk}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid layout for displaying saved models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {savedModels.map((model) => (
          <div key={model.id} className="group relative">
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
                <p>AGE: {model.age}</p>
              </div>
              <p className="text-sm text-gray-600">TYPE: {model.type}</p>
            </div>
            {isSelectionActive && (
              <button
                onClick={() => toggleModelSelection(model.id)}
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 ${
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
    </div>
  );
}
