import React from "react";
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

export function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#DD8560] text-white p-8 flex flex-col transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-[300px] min-w-[250px] md:w-[250px] sm:w-[200px] sm:min-w-[200px]`}
      style={{
        zIndex: isOpen ? 50 : 0,
      }}
    >
      <button
        className="absolute top-4 right-4 md:hidden"
        onClick={toggleSidebar}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="mb-8 flex justify-center">
        <img
          src={ModellaLogo || "/placeholder.png"}
          alt="Modella Logo"
          className="w-32 h-auto"
        />
      </div>
      <nav className="space-y-6 mt-4 font-medium">
        <NavItem icon={Compass} label="Explore" />
        <hr className="border-t border-white/50" />
        <NavItem icon={Layout} label="Swipe Page" />
        <hr className="border-t border-white/50" />
        <NavItem icon={Bookmark} label="Saved List" />
        <hr className="border-t border-white/50" />
        <NavItem icon={MessageCircle} label="Chats" />
        <hr className="border-t border-white/50" />
        <NavItem icon={User} label="Account" />
        <hr className="border-t border-white/50" />
        <NavItem icon={Settings} label="Settings" />
      </nav>
    </div>
  );
}

function NavItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <a
      href="#"
      className="flex items-center space-x-4 text-lg hover:opacity-80 transition-opacity"
    >
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </a>
  );
}
