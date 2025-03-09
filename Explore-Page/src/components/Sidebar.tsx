import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Compass,
  Layout,
  Bookmark,
  MessageCircle,
  User,
  Settings,
  Menu,
  ArrowLeft,
} from "lucide-react";
import ModellaLogo from "../images/Image-7.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userType: "model" | "business";
}

export function Sidebar({ isOpen, toggleSidebar, userType }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#DD8560] text-white flex flex-col transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-[260px] overflow-y-auto`}
      style={{
        zIndex: isOpen ? 50 : 0,
      }}
    >
      <div className="p-8 flex flex-col min-h-full">
        <button
          className="absolute top-4 right-4 md:hidden cursor-pointer"
          onClick={toggleSidebar}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="mb-8 mt-4">
          <img
            src={ModellaLogo || "/placeholder.png"}
            alt="Modella Logo"
            className="w-32 h-auto mx-auto"
          />
        </div>

        <div className="text-center mb-4">
          <span className="bg-white/10 px-6 py-2 rounded-full text-sm font-medium shadow-md">
            {userType === "model" ? "Model Interface" : "Business Interface"}
          </span>
        </div>

        <nav className="flex-1 flex flex-col justify-start space-y-2 mt-4 font-medium min-h-0">
          <div className="py-4">
            <NavItem
              icon={Compass}
              label="Explore"
              to="/explore"
              isActive={
                location.pathname === "/explore" || location.pathname === "/"
              }
            />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem
              icon={Layout}
              label="Swipe Page"
              to="/swipe"
              isActive={location.pathname === "/swipe"}
            />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem
              icon={Bookmark}
              label="Saved List"
              to="/saved"
              isActive={location.pathname === "/saved"}
            />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem
              icon={MessageCircle}
              label="Chats"
              to="/chats"
              isActive={location.pathname === "/chats"}
            />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem
              icon={User}
              label="Account"
              to="/account"
              isActive={location.pathname === "/account"}
            />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
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
  );
}

function NavItem({
  icon: Icon,
  label,
  to,
  isActive,
}: {
  icon: any;
  label: string;
  to: string;
  isActive: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-4 px-2 py-1.5 rounded-lg transition-all duration-200 ${
        isActive ? "bg-white/20" : "hover:bg-white/10"
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-lg">{label}</span>
    </Link>
  );
}
