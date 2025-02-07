import { useState } from "react";

import CarnageLogo from "../images/Image-19.png";

type Tab = "PROJECTS" | "VIDEOS" | "IMAGES";

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("PROJECTS");

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
              <button className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors">
                Projects +
              </button>
            </div>
          </div>

          <div className="flex gap-8 mb-6">
            <div className="text-center md:text-left">
              <span className="font-medium">10</span> Projects
            </div>
            <div className="text-center md:text-left">
              <span className="font-medium">800</span> Followers
            </div>
            <div className="text-center md:text-left">
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
              className={`py-2 px-4 font-medium relative ${
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
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={`/placeholder.svg?height=400&width=400&text=Project+${item}`}
              alt={`Project ${item}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
