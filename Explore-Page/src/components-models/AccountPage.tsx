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

type Tab = "IMAGES" | "VIDEOS";

// Add type definitions
type ImageType = string;
type VideoType = string;

// Add new type for media item
type MediaItem = {
  url: string;
  description: string;
  type: 'image' | 'video';
};

export function AccountPage({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("IMAGES");
  const [isProfilePicturePopoverOpen, setIsProfilePicturePopoverOpen] =
    useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [currentProfilePicture, setCurrentProfilePicture] =
    useState(CarnageLogo);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState("");
  const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false);
  const [videoUpload, setVideoUpload] = useState<File | null>(null);
  const [videoDescription, setVideoDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<MediaItem[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  

  // Explicitly type the arrays
  const images: ImageType[] = []; // Add image URLs here if available
  const videos: VideoType[] = []; // Add video URLs here if available

  // Handle profile picture upload
  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = () => {
    if (profilePicture) {
      // In a real app, you would upload the image to a server here
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(profilePicture);
    }
    setIsProfilePicturePopoverOpen(false);
    setProfilePicture(null);
  };

  // Add this new handler
  const handleImagePost = () => {
    if (imageUpload) {
      const imageUrl = URL.createObjectURL(imageUpload);
      setUploadedImages(prev => [...prev, { url: imageUrl, description: imageDescription, type: 'image' }]);
      setImageUpload(null);
      setImageDescription("");
      setIsImagePopoverOpen(false);
    }
  };

  // Add this new handler
  const handleVideoPost = () => {
    if (videoUpload) {
      const videoUrl = URL.createObjectURL(videoUpload);
      setUploadedVideos(prev => [...prev, { url: videoUrl, description: videoDescription, type: 'video' }]);
      setVideoUpload(null);
      setVideoDescription("");
      setIsVideoPopoverOpen(false);
    }
  };

  // Add new handler for media click
  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  // Add new handler for closing media modal
  const handleCloseMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedMedia(null);
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
        <div
          className="w-48 h-48 rounded-full overflow-hidden bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => setIsProfilePicturePopoverOpen(true)}
        >
          <img
            src={currentProfilePicture}
            alt="Carnage Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Model Name</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsImagePopoverOpen(true)}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer"
              >
                Image +
              </button>
              <button
                onClick={() => setIsVideoPopoverOpen(true)}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer"
              >
                Video +
              </button>
            </div>
          </div>

          <div className="flex gap-8 mb-6">
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">{uploadedImages.length}</span> Images
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">{uploadedVideos.length}</span> Videos
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Name</h2>
            <p className="text-gray-600">
             Bringing style to life with every shot. Passionate, versatile, and always on trend.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Picture Upload Modal */}
      {isProfilePicturePopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative shadow-xl">
            <button
              onClick={() => setIsProfilePicturePopoverOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#DD8560]"
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>

            <h2 className="text-2xl font-medium mb-4 text-[#DD8560]">
              Update Profile Picture
            </h2>

            <div className="space-y-4">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="w-full border rounded p-2 cursor-pointer"
                />
                {profilePicture && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Preview"
                      className="max-w-64 max-h-64 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setIsProfilePicturePopoverOpen(false);
                  setProfilePicture(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleUpdateProfilePicture}
                disabled={!profilePicture}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add this new Image Upload Popover */}
      {isImagePopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-xl">
            <button
              onClick={() => setIsImagePopoverOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#DD8560] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-medium mb-4 text-[#DD8560]">
              Upload Image
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageUpload(e.target.files[0]);
                    }
                  }}
                  className="w-full border rounded p-2 cursor-pointer"
                />
                {imageUpload && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={URL.createObjectURL(imageUpload)}
                      alt="Preview"
                      className="max-w-64 max-h-64 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  className="w-full border rounded p-2 h-24"
                  placeholder="Add a description for your image..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsImagePopoverOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleImagePost}
                  disabled={!imageUpload}
                  className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Post Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this new Video Upload Popover */}
      {isVideoPopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-xl">
            <button
              onClick={() => setIsVideoPopoverOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#DD8560] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-medium mb-4 text-[#DD8560]">
              Upload Video
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Select Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setVideoUpload(e.target.files[0]);
                    }
                  }}
                  className="w-full border rounded p-2 cursor-pointer"
                />
                {videoUpload && (
                  <div className="mt-4 flex justify-center">
                    <video
                      src={URL.createObjectURL(videoUpload)}
                      controls
                      className="max-w-64 max-h-64 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  className="w-full border rounded p-2 h-24"
                  placeholder="Add a description for your video..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsVideoPopoverOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleVideoPost}
                  disabled={!videoUpload}
                  className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Post Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t mt-8">
        <div className="flex justify-center gap-8 mt-4">
          {(["IMAGES", "VIDEOS"] as Tab[]).map((tab) => (
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
        {activeTab === "IMAGES" && uploadedImages.length > 0 ? (
          uploadedImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleMediaClick(image)}
            >
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : activeTab === "VIDEOS" && uploadedVideos.length > 0 ? (
          uploadedVideos.map((video, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleMediaClick(video)}
            >
              <video
                src={video.url}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            {activeTab === "IMAGES"
              ? "No Images posted"
              : "No Videos found"}
          </div>
        )}
      </div>

      {/* Media Detail Modal */}
      {isMediaModalOpen && selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 overflow-y-auto"
          style={{ backdropFilter: "blur(8px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseMediaModal();
          }}
        >
          <div className="bg-white w-full max-w-5xl h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex relative my-auto">
            {/* Close button */}
            <button
              onClick={handleCloseMediaModal}
              className="absolute top-4 right-4 z-20 bg-white/90 rounded-full p-2 hover:bg-white transition-all shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {/* Media column - larger */}
            <div className="w-2/3 h-full bg-gray-100 relative">
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Selected media"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Details column - smaller */}
            <div className="w-1/3 h-full flex flex-col p-6 overflow-y-auto">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMedia.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}