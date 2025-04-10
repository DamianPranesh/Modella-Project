import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Compass,
  Layout,
  Bookmark,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react";
import ModellaLogo from "../images/Image-7.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userType: "model" | "business";
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
}

function NavItem({ icon: Icon, label, to, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive ? "bg-white/20" : "hover:bg-white/10"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-base">{label}</span>
    </Link>
  );
}

export function Sidebar({ isOpen, toggleSidebar, userType }: SidebarProps) {
  const location = useLocation();

  // Lock body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling when sidebar is open on mobile
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`fixed left-0 top-0 h-full w-[260px] max-w-[80vw] bg-[#DD8560] text-white flex flex-col transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto z-50`}
      >
        <div className="p-6 flex flex-col min-h-full">
          <button
            className="absolute top-4 right-4 md:hidden cursor-pointer"
            onClick={toggleSidebar}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="mb-6 mt-6">
            <img
              src={ModellaLogo || "/placeholder.png"}
              alt="Modella Logo"
              className="w-28 h-auto mx-auto"
            />
          </div>

          <div className="text-center mb-4">
            <span className="bg-white/10 px-6 py-2 rounded-full text-sm font-medium shadow-md">
              {userType === "model" ? "Model" : "Business"}
            </span>
          </div>

          {/* All the navigation items are listed below */}
          <nav className="flex-1 flex flex-col justify-start space-y-1 mt-4 font-medium min-h-0">
            <div className="py-3">
              <NavItem
                icon={Compass}
                label="Explore"
                to="/explore"
                isActive={
                  location.pathname === "/explore" || location.pathname === "/"
                }
              />
            </div>
            <hr className="border-t border-white/30" />
            <div className="py-3">
              <NavItem
                icon={Layout}
                label="Swipe Page"
                to="/swipe"
                isActive={location.pathname === "/swipe"}
              />
            </div>
            <hr className="border-t border-white/30" />
            <div className="py-3">
              <NavItem
                icon={Bookmark}
                label="Saved List"
                to="/saved"
                isActive={location.pathname === "/saved"}
              />
            </div>
            <hr className="border-t border-white/30" />
            <div className="py-3">
              <NavItem
                icon={User}
                label="Account"
                to="/account"
                isActive={location.pathname === "/account"}
              />
            </div>
            <hr className="border-t border-white/30" />
            <div className="py-3">
              <NavItem
                icon={Settings}
                label="Settings"
                to="/settings"
                isActive={location.pathname === "/settings"}
              />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;