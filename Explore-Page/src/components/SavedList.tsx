"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ComparisonModal from "./ComparisonModel";
import ModelDetailModal from "./ModelDetailModal";
import { fetchData } from "../api/api";

type Model = {
  id: string;
  name: string;
  bio: string;
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

const userId = "brand_67c5b2c43ae5b4ccb85b9a11";

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

  //Dynamic modification
  const [savedUserIds, setSavedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchSavedUserIds = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch saved user IDs
        const savedListResponse = await fetchData(`savedList/${userId}`);
        const ids = savedListResponse.saved_Ids || [];

        console.log("Fetched saved user IDs:", ids); // Log to console
        setSavedUserIds(ids);
      } catch (error) {
        setError("Failed to load saved user IDs.");
        console.error("Error fetching saved user IDs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedUserIds();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 2: Iterate over savedUserIds and fetch user data for each user_Id
        const newModels: Model[] = []; // New array to store the fetched models

        for (let id of savedUserIds) {
          // Fetch basic user data
          const userResponse = await fetchData(`users/${id}`);
          const { user_Id, name, bio, social_Media_URL } = userResponse;

          // Fetch additional model tag data from ModellaTag endpoint
          const tagResponse = await fetchData(`ModellaTag/tags/models/${id}`);
          const modelTag = tagResponse ? tagResponse : {};

          // Fetch the profile image URL
          const fileUrlResponse = await fetchData(
            `files/urls-for-user-id-and-foldername-with-limits?user_id=${id}&folder=profile-pic&limit=4`
          );
          // const profileImage = fileUrlResponse && fileUrlResponse[0]?.s3_url;
          const profileImage = Array.isArray(fileUrlResponse)
            ? fileUrlResponse.map((file) => file.s3_url)
            : [];

          // Step 3: Create a model object and add it to the newModels array
          newModels.push({
            id: user_Id,
            name: name,
            bio: bio,
            age: modelTag.age || 0,
            type: modelTag.work_Field || "Unknown",
            image: profileImage || "",
            socialUrls: social_Media_URL || [
              "@modellahandle",
              "@modellahandle",
              "www.modelportfolio.com",
            ],
            height: modelTag.height || "?",
            eyeColor: modelTag.natural_eye_color || "Unknown",
            bodyType: modelTag.body_Type || "Unknown",
            skinTone: modelTag.skin_Tone || "Unknown",
            gender: modelTag.gender || "Unknown",
            experience: modelTag.experience_Level || "Unknown",
            location: modelTag.location || "Unknown",
            bust: modelTag.bust_chest || "?",
            waist: modelTag.waist || "?",
            hips: modelTag.hips || "?",
            shoeSize: modelTag.shoe_Size || "?",
          });

          // Optionally log to the console as well
          console.log(
            `User ID: ${user_Id}, Name: ${name}, Profile Image: ${profileImage}, Model Data:`,
            modelTag
          );
        }

        // Step 4: Update the fetchedModels state with the new models
        setSavedModels(newModels);
      } catch (error) {
        setError("Failed to load user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (savedUserIds.length > 0) {
      fetchUserData();
    }
  }, [savedUserIds]);

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
      {savedUserIds.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">
          No saved items in the Saved List
        </p>
      ) : (
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
                  src={model.image[0] || "/placeholder.svg"}
                  alt={model.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">NAME: {model.name}</p>
                  <p>AGE: {model.age}</p>
                </div>
                <p className="text-sm text-gray-600">
                  TYPE: {model.type.join(", ")}
                </p>
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
      )}

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
