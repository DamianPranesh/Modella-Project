import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// Import your images and components
import ProjectDetailModal from "./ProjectDetailModal";
import { fetchData } from "../api/api";
import { useUser } from "../components-login/UserContext";

// Define types for tabs, images, videos and projects
type Tab = "PROJECTS" | "VIDEOS" | "IMAGES";

export type ImageType = {
  url: string;
  description: string;
};

export type VideoType = {
  url: string;
  description: string;
};

export type Project = {
  name: string;
  image: string;
  description: string;
  tags: string[];
  minAge: string;
  maxAge: string;
};

// Define type for projects as returned by the API
interface APIProject {
  user_Id: string;
  project_Id: string;
  name?: string;
  description?: string;
}

// Define type for file responses (used for images and videos)
interface FileResponse {
  s3_url: string;
  description: string;
}

/**
 * AccountPage Component
 *
 * A comprehensive profile page component that allows users to:
 * - View and update their profile picture
 * - Upload and manage projects, images, and videos
 * - View their content in a grid layout
 * - Interact with media through a modal view
 */
export function AccountPage({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  // State management for UI controls and data
  const [activeTab, setActiveTab] = useState<Tab>("PROJECTS");
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);
  const [isProfilePicturePopoverOpen, setIsProfilePicturePopoverOpen] =
    useState(false);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false);
  const [videoUpload, setVideoUpload] = useState<File | null>(null);
  const [videoDescription, setVideoDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [modelingTags, setModelingTags] = useState<string[]>([]);

  // const user_id = "brand_67c5b2c43ae5b4ccb85b9a11";
  const { userId } = useUser();
  const user_id = userId || "";
  const [user, setUser] = useState<{
    name: string;
    bio: string | null;
    email: string;
  }>({
    name: "",
    bio: null,
    email: "",
  });

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
          email: userData.email,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      const response = await fetchData(
        `files/files/latest?user_id=${user_id}&folder=profile-pic`
      );
      if (response && response.s3_url) {
        setCurrentProfilePicture(response.s3_url);
      }
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchImages = async () => {
    try {
      const response: FileResponse[] = await fetchData(
        `files/urls-for-user-id-and-foldername-with-limits?user_id=${user_id}&folder=image`
      );
      if (response) {
        const formattedImages = response.map((file: FileResponse) => ({
          url: file.s3_url,
          description: file.description,
        }));
        setImages(formattedImages);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchVideos = async () => {
    try {
      const response: FileResponse[] = await fetchData(
        `files/urls-for-user-id-and-foldername-with-limits?user_id=${user_id}&folder=video`
      );
      if (response) {
        const formattedVideos = response.map((file: FileResponse) => ({
          url: file.s3_url,
          description: file.description,
        }));
        setVideos(formattedVideos);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    }
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchProjects = async () => {
    try {
      // Step 1: Get all projects
      const projectList: APIProject[] = await fetchData(
        `Brandprojects/projects/user/${user_id}`
      );
      if (!projectList) return;

      // Step 2: Fetch all project images at once (order-dependent)
      const imageResponse: FileResponse[] = await fetchData(
        `files/urls-for-user-id-and-foldername-with-limits?user_id=${user_id}&folder=project`
      );

      // Step 3: Fetch all project tags at once (with proper type)
      const projectTags = await Promise.all(
        projectList.map(async (project: APIProject) => {
          try {
            return (await fetchData(
              `ModellaTag/tags/projects/${project.user_Id}/${project.project_Id}`
            )) as {
              project_Id: string;
              age: number[] | null;
              work_Field: string[];
            };
          } catch {
            return {
              project_Id: project.project_Id,
              age: null,
              work_Field: [],
            };
          }
        })
      );

      // Map tags to project IDs
      const projectTagMap: Record<
        string,
        { age: number[] | null; work_Field: string[] }
      > = projectTags.reduce((acc, tag) => {
        acc[tag.project_Id] = {
          age: tag.age,
          work_Field: tag.work_Field,
        };
        return acc;
      }, {} as Record<string, { age: number[] | null; work_Field: string[] }>);

      const projectsWithDetails: Project[] = projectList.map(
        (project, index) => ({
          name: project.name || "Untitled Project",
          image: imageResponse[index]?.s3_url || "",
          description: project.description || "No description provided.",
          tags: projectTagMap[project.project_Id]?.work_Field || [],
          minAge: projectTagMap[project.project_Id]?.age
            ? String(projectTagMap[project.project_Id].age![0])
            : "",
          maxAge: projectTagMap[project.project_Id]?.age
            ? String(projectTagMap[project.project_Id].age![1])
            : "",
        })
      );

      setProjects(projectsWithDetails);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  /**
   * Handles image file selection for project upload
   * @param e - Change event from file input
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImage(e.target.files[0]);
    }
  };

  /**
   * Handles profile picture file selection
   * @param e - Change event from file input
   */
  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append("file", profilePicture); // Only file is added here

    // Construct the query string for parameters
    const queryParams = new URLSearchParams({
      user_id: user_id,
      folder: "profile-pic",
      is_private: "false", // Ensure it's a string, since URLSearchParams requires strings
    }).toString();

    try {
      console.log("Uploading profile picture:", profilePicture);

      const uploadResponse = await fetchData(`files/upload/?${queryParams}`, {
        method: "POST",
        body: formData, // Only formData, so browser sets correct headers
      });

      console.log("Upload successful:", uploadResponse);

      await fetchProfilePicture();
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setIsProfilePicturePopoverOpen(false);
      setProfilePicture(null);
    }
  };

  /**
   * Toggles the selection state of a modeling tag
   * @param tag - The tag to toggle
   */
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePostProject = async () => {
    if (!projectName || !projectDescription || !projectImage) return;

    try {
      // Step 1: Create the project
      const projectPayload = {
        user_Id: user_id,
        name: projectName,
        description: projectDescription,
      };

      const createdProject = await fetchData("Brandprojects/projects/", {
        method: "POST",
        body: JSON.stringify(projectPayload),
        headers: { "Content-Type": "application/json" },
      });

      if (!createdProject || !createdProject.project_Id) {
        throw new Error("Project creation failed");
      }

      const project_Id = createdProject.project_Id; // Get the generated project ID

      // Step 2: Upload project image
      const formData = new FormData();
      formData.append("file", projectImage);

      const imageUploadUrl = `files/upload/?user_id=${user_id}&folder=project&is_private=false&description=${projectDescription}&project_id=${project_Id}`;

      await fetchData(imageUploadUrl, {
        method: "POST",
        body: formData,
      });

      console.log("Project image uploaded successfully");

      // Step 3: Create project tags (Age & Modeling Categories)
      const tagPayload = {
        user_Id: user_id,
        project_Id: project_Id,
        age: [parseInt(minAge), parseInt(maxAge)], // Convert age to tuple
        work_Field: selectedTags, // Modeling categories
      };

      await fetchData("ModellaTag/tags/projects/", {
        method: "POST",
        body: JSON.stringify(tagPayload),
        headers: { "Content-Type": "application/json" },
      });

      console.log("Project tags added successfully");

      // Step 4: Refresh project list
      fetchProjects();
    } catch (error) {
      console.error("Error uploading project:", error);
    } finally {
      setProjectName("");
      setProjectImage(null);
      setProjectDescription("");
      setSelectedTags([]);
      setMinAge("");
      setMaxAge("");
      setIsProjectPopoverOpen(false);
    }
  };

  const handleImagePost = async () => {
    if (!imageUpload) return;

    const formData = new FormData();
    formData.append("file", imageUpload);

    // Construct query parameters
    const queryParams = new URLSearchParams({
      user_id: user_id,
      folder: "image",
      is_private: "false",
      description: imageDescription || "No description",
    }).toString();

    try {
      console.log("Uploading image:", imageUpload.name);

      await fetchData(`files/upload/?${queryParams}`, {
        method: "POST",
        body: formData, // Only the file is in formData
      });

      console.log("Image uploaded successfully");

      // Fetch updated images after upload
      fetchImages();
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setImageUpload(null);
      setImageDescription("");
      setIsImagePopoverOpen(false);
    }
  };

  /**
   * Handles video file selection
   * @param e - Change event from file input
   */
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoUpload(e.target.files[0]);
    }
  };

  const handleVideoPost = async () => {
    if (!videoUpload) return;

    const formData = new FormData();
    formData.append("file", videoUpload);

    // Construct query parameters for the API call
    const queryParams = new URLSearchParams({
      user_id: user_id,
      folder: "video", // <-- Using "video" instead of "image"
      is_private: "false",
      description: videoDescription || "No description",
    }).toString();

    try {
      console.log("Uploading video:", videoUpload.name);

      await fetchData(`files/upload/?${queryParams}`, {
        method: "POST",
        body: formData, // Sending form data for the file upload
      });

      console.log("Video uploaded successfully");

      // Fetch updated video list after upload
      fetchVideos();
    } catch (error) {
      console.error("Failed to upload video:", error);
    } finally {
      setVideoUpload(null);
      setVideoDescription("");
      setIsVideoPopoverOpen(false);
    }
  };

  /**
   * Handles clicking on media items (images or videos)
   * Opens the media modal with the selected content
   * @param media - The selected media item
   * @param type - The type of media ('image' or 'video')
   */
  const handleMediaClick = (
    media: ImageType | VideoType,
    type: "image" | "video"
  ) => {
    if (type === "image") {
      setSelectedImage(media);
    } else {
      setSelectedVideo(media);
    }
    setIsMediaModalOpen(true);
  };

  /**
   * Closes the media modal and resets selected media
   */
  const handleCloseMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedImage(null);
    setSelectedVideo(null);
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
            <h1 className="text-2xl font-medium">
              {user.name || "Default User"}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsProjectPopoverOpen(true)}
                className="px-4 py-2 bg-[#DD8560] text-white rounded-full hover:bg-opacity-90 transition-colors hover:scale-105 cursor-pointer"
              >
                Project +
              </button>
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
              <span className="font-medium">{projects.length}</span> Projects
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">{images.length}</span> Images
            </div>
            <div className="text-center md:text-left hover:text-[#DD8560] transition-colors cursor-pointer">
              <span className="font-medium">{videos.length}</span> Videos
            </div>
          </div>

          <div className="mb-6">
            <h2 className="inline text-lg font-semibold text-[#DD8560] mr-2">
              Email:
            </h2>
            <span className="text-gray-900 text-sm">
              {user.email || "Default email"}
            </span>
            <p className="text-gray-600 mt-2">
              {user.bio || "No bio available"}
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
      {isProfilePicturePopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative shadow-xl">
            <button
              onClick={() => {
                setIsProfilePicturePopoverOpen(false);
                setProfilePicture(null);
              }}
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

      {/* Add Video Upload Popover */}
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
                  onChange={handleVideoUpload}
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
          {(["PROJECTS", "IMAGES", "VIDEOS"] as Tab[]).map((tab) => (
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
              onClick={() => handleMediaClick(image, "image")}
            >
              <img
                src={image.url}
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
              onClick={() => handleMediaClick(video, "video")}
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
              : activeTab === "VIDEOS"
              ? "No Videos found"
              : "No Projects available"}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject!}
      />

      {/* Media Detail Modal */}
      {isMediaModalOpen && (
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
              {selectedVideo ? (
                <video
                  src={selectedVideo.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt="Selected media"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Details column - smaller */}
            <div className="w-1/3 h-full flex flex-col p-6 overflow-y-auto">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedImage?.description ||
                    selectedVideo?.description ||
                    "No description provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
