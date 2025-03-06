import React from "react";
import { X } from "lucide-react";

type Project = {
  name: string;
  image: string;
  description: string;
  tags: string[];
  minAge: string;
  maxAge: string;
};

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      // Optional: Prevent scroll on mobile
      document.body.style.touchAction = "none";

      return () => {
        // Restore scrolling when modal closes
        document.body.style.overflow = "unset";
        document.body.style.position = "static";
        document.body.style.width = "auto";
        document.body.style.touchAction = "auto";
      };
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 overflow-y-auto"
      style={{ backdropFilter: "blur(8px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-5xl h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex relative my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 rounded-full p-2 hover:bg-white transition-all shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* Image column - larger */}
        <div className="w-2/3 h-full bg-gray-100 relative">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details column - smaller */}
        <div className="w-1/3 h-full flex flex-col p-6 overflow-y-auto">
          {/* Project name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {project.name}
          </h2>

          {/* Age range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Age Range
            </h3>
            <p className="text-lg font-medium text-gray-900">
              {project.minAge} - {project.maxAge} years
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Modeling tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Modeling Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-pink-50 text-[#DD8560] rounded-full text-sm cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;