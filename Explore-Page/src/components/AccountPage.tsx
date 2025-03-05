import { useState } from "react";
import { Menu, X } from "lucide-react";

import CarnageLogo from "../images/Image-19.png";

// Import your images
import projectImage1 from "../images/Image-20.jpg";
import projectImage2 from "../images/Image-21.jpg";
import projectImage3 from "../images/Image-22.jpg";
import projectImage4 from "../images/Image-23.jpg";
import projectImage5 from "../images/Image-24.jpg";
import projectImage6 from "../images/Image-25.jpg";

type Tab = "PROJECTS" | "VIDEOS" | "IMAGES";

// Add type definitions
type ImageType = string;
type VideoType = string;

export function AccountPage({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("PROJECTS");
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  // Array of project images
  const projectImages = [
    projectImage1,
    projectImage2,
    projectImage3,
    projectImage4,
    projectImage5,
    projectImage6,
  ];

  // Explicitly type the arrays
  const images: ImageType[] = []; // Add image URLs here if available
  const videos: VideoType[] = []; // Add video URLs here if available

  // Tags for modeling categories
  const modelingTags = [
    "Fashion/Runway Modeling",
    "Commercial Modeling",
    "Beauty Modeling",
    "Lingerie/Swimsuit Modeling",
    "Fitness Modeling",
    "Plus-Size Modeling",
    "Editorial Modeling",
    "Child Modeling",
    "Parts Modeling",
    "Catalog Modeling",
    "Runway Modeling",
    "Commercial Print Modeling",
    "Virtual Modeling",
    "Lifestyle Modeling",
  ];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImage(e.target.files[0]);
    }
  };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle project submission
  const handlePostProject = () => {
    // Here you would typically send the project data to a backend
    console.log({
      image: projectImage,
      description: projectDescription,
      tags: selectedTags,
      minAge,
      maxAge,
    });
    // Reset form and close popover
    setProjectImage(null);
    setProjectDescription("");
    setSelectedTags([]);
    setMinAge("");
    setMaxAge("");
    setIsProjectPopoverOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <button className="md:hidden mb-4 cursor-pointer" onClick={toggleSidebar}>
        <Menu
          className={`w-6 h-6 ${
            isSidebarOpen ? "text-white" : "text-[#DD8560]"
          }`}
        />
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={CarnageLogo}
            alt="Carnage Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Carnage.lk</h1>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer">
                Edit Profile
              </button>
              <button
                onClick={() => setIsProjectPopoverOpen(true)}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer"
              >
                Projects +
              </button>
            </div>
          </div>

          <div className="flex gap-8 mb-6">
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">6</span> Projects
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">0</span> Images
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">0</span> Videos
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">CARNAGE</h2>
            <p className="text-gray-600">
              Step into style with Carnage - Sri Lanka's #1 active and lifestyle
              brand, crafted for fashion models who demand comfort and
              versatility. From oversized tees and premium joggers to leggings
              and biker shorts, our high-quality pieces keep you runway-ready
              every day. Elevate your look and own the spotlight with Carnage.
            </p>
          </div>
        </div>
      </div>

      {isProjectPopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative shadow-xl">
            <button
              onClick={() => setIsProjectPopoverOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#DD8560]"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-medium mb-4 text-[#DD8560]">
              Upload Project
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border rounded p-2"
                  />
                  {projectImage && (
                    <p className="text-sm text-gray-600 mt-2">
                      {projectImage.name}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full border rounded p-2 h-24"
                    placeholder="Describe your project..."
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">
                      Min Age
                    </label>
                    <input
                      type="number"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                      className="w-full border rounded p-2"
                      placeholder="Min Age"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">
                      Max Age
                    </label>
                    <input
                      type="number"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                      className="w-full border rounded p-2"
                      placeholder="Max Age"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Modeling Categories
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {modelingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-[#DD8560] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsProjectPopoverOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handlePostProject}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors"
              >
                Post Project
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t mt-8">
        <div className="flex justify-center gap-8 mt-4">
          {(["PROJECTS", "VIDEOS", "IMAGES"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium relative transition-colors hover:text-[#DD8560] cursor-pointer ${
                activeTab === tab ? "text-[#DD8560]" : "text-gray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DD8560]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeTab === "PROJECTS" && projectImages.length > 0 ? (
          projectImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={image}
                alt={`Project ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : activeTab === "IMAGES" && images.length > 0 ? (
          images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : activeTab === "VIDEOS" && videos.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <video
                src={video}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            {activeTab === "IMAGES"
              ? "No Images posted"
              : activeTab === "VIDEOS"
              ? "No Videos found"
              : "No Projects available"}
          </div>
        )}
      </div>
    </div>
  );
}
