import { useState } from "react";

import CarnageLogo from "../images/Image-19.png";

// Import your images
import projectImage1 from "../images/Image-20.jpg";
import projectImage2 from "../images/Image-21.jpg";
import projectImage3 from "../images/Image-22.jpg";
import projectImage4 from "../images/Image-23.jpg";
import projectImage5 from "../images/Image-24.jpg";
import projectImage6 from "../images/Image-25.jpg";

type Tab = "PROJECTS" | "VIDEOS" | "IMAGES";

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("PROJECTS");

  // Array of project images
  const projectImages = [
    projectImage1,
    projectImage2,
    projectImage3,
    projectImage4,
    projectImage5,
    projectImage6,
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={CarnageLogo}
            alt="Carnage Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 className="text-2xl font-medium">Carnage.lk</h1>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer">
                Projects +
              </button>
            </div>
          </div>

          <div className="flex gap-8 mb-6">
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">10</span> Projects
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">800</span> Followers
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">153</span> Connections
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

      {/* Tabs */}
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

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectImages.map((image, index) => (
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
        ))}
      </div>
    </div>
  );
}
