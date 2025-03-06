import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { fetchData } from "../api/api";

import CarnageLogo from "../images/Image-19.png";

// Import your images
import projectImage1 from "../images/Image-20.jpg";
import projectImage2 from "../images/Image-21.jpg";
import projectImage3 from "../images/Image-22.jpg";
import projectImage4 from "../images/Image-23.jpg";
import projectImage5 from "../images/Image-24.jpg";
import projectImage6 from "../images/Image-25.jpg";
import ProjectDetailModal from "./ProjectDetailModal";

type Tab = "PROJECTS" | "VIDEOS" | "IMAGES";

// Add type definitions
type ImageType = string;
type VideoType = string;

// Add this type definition
type Project = {
  name: string;
  image: string;
  description: string;
  tags: string[];
  minAge: string;
  maxAge: string;
};

export function AccountPage({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("PROJECTS");
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);
  const [isProfilePicturePopoverOpen, setIsProfilePicturePopoverOpen] =
    useState(false);
  const [projectImage, setProjectImage] = useState<File | null>(null);

  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [currentProfilePicture, setCurrentProfilePicture] =
    useState(CarnageLogo);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const user_id = "brand_67c5b2c43ae5b4ccb85b9a11";

  const [modelingTags, setModelingTags] = useState<string[]>([]);

  const [user, setUser] = useState<{ name: string; bio: string | null }>({
    name: "",
    bio: null,
  });

  // const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(
    CarnageLogo
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchModelingTags = async () => {
      try {
        const tags = await fetchData("keywords/filters/work_fields");
        console.log("Fetched modeling tags:", tags);
        setModelingTags(tags);
      } catch (error) {
        console.error("Failed to fetch modeling tags:", error);
      }
    };

    fetchModelingTags();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchData(`users/${user_id}`);
        setUser({
          name: userData.name,
          bio: userData.bio,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await fetchData(
          `files/files/latest?user_id=${user_id}&folder=profile-pic`
        );

        if (response && response.s3_url) {
          setProfilePicture(response.s3_url);
          // setProfilePicture(`${response.s3_url}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfilePicture();
  }, []);

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

  // Add sample project data (in a real app, this would come from your backend)
  const projects: Project[] = projectImages.map((image, index) => ({
    name: `Project ${index + 1}`,
    image: image,
    description:
      "This is a sample project description. It showcases our latest work in fashion and modeling.",
    tags: [
      "Fashion/Runway Modeling",
      "Commercial Modeling",
      "Editorial Modeling",
    ],
    minAge: "18",
    maxAge: "25",
  }));

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImage(e.target.files[0]);
    }
  };

  // // Handle profile picture upload
  // const handleProfilePictureUpload = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProfilePicture(e.target.files[0]);
  //   }
  // };

  // // Handle profile picture update
  // const handleUpdateProfilePicture = () => {
  //   if (profilePicture) {
  //     // In a real app, you would upload the image to a server here
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setCurrentProfilePicture(reader.result as string);
  //     };
  //     reader.readAsDataURL(profilePicture);
  //   }
  //   setIsProfilePicturePopoverOpen(false);
  //   setProfilePicture(null);
  // };

  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  // // Handle profile picture file selection
  // const handleProfilePictureUpload = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setSelectedFile(file);
  //     setImagePreview(URL.createObjectURL(file)); // Temporary preview
  //   }
  // };

  // // Upload profile picture to backend
  // const handleUpdateProfilePicture = async () => {
  //   if (!selectedFile) return;

  //   const formData = new FormData();
  //   formData.append("file", selectedFile);
  //   formData.append("user_id", user_id);
  //   formData.append("folder", "profile-pic");

  //   try {
  //     const response = await fetchData(`files/upload/`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to upload profile picture");
  //     }

  //     console.log("Profile picture uploaded successfully!");
  //     //fetchProfilePicture(); // Refresh to get latest profile picture
  //     setIsProfilePicturePopoverOpen(false); // Close modal
  //     setSelectedFile(null);
  //     setImagePreview(null);
  //   } catch (error) {
  //     console.error("Error uploading profile picture:", error);
  //   }
  // };

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle project submission
  const handlePostProject = () => {
    console.log({
      name: projectName,
      image: projectImage,
      description: projectDescription,
      tags: selectedTags,
      minAge,
      maxAge,
    });
    setProjectName("");
    setProjectImage(null);
    setProjectDescription("");
    setSelectedTags([]);
    setMinAge("");
    setMaxAge("");
    setIsProjectPopoverOpen(false);
  };

  // Add this new handler
  const handleImagePost = () => {
    console.log({
      image: imageUpload,
      description: imageDescription,
    });
    setImageUpload(null);
    setImageDescription("");
    setIsImagePopoverOpen(false);
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
          {isLoading ? (
            <p className="text-gray-500">Loading...</p> // Show loading text while fetching
          ) : profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile Picture"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-500">No Image</p> // Show fallback text if no image is available
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">{user.name}</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsImagePopoverOpen(true)}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer"
              >
                Image +
              </button>
              <button
                onClick={() => setIsProjectPopoverOpen(true)}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer"
              >
                Project +
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
            <h2 className="text-xl font-medium mb-2">{user.name}</h2>
            <p className="text-gray-600">{user.bio || "No bio available"}</p>
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
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Enter project name..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border rounded p-2 cursor-pointer"
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
                      className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handlePostProject}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors cursor-pointer"
              >
                Post Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Upload Modal */}
      {/* {isProfilePicturePopoverOpen && (
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
                      src={profilePicture}
                      alt="Preview"
                      className="max-w-64 max-h-64 object-cover rounded"
                    />
                  </div>
                )}
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imagePreview}
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
                disabled={!selectedFile}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      )} */}

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
        {activeTab === "PROJECTS" && projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.image}
                alt={project.name}
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

      {/* Add the ProjectDetailModal */}
      <ProjectDetailModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject!}
      />
    </div>
  );
}
