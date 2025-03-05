// import React from "react";
// import {
//   Compass,
//   Layout,
//   Bookmark,
//   MessageCircle,
//   User,
//   Settings,
//   Menu,
//   ArrowLeft,
// } from "lucide-react";
// import ModellaLogo from "../images/Image-7.png";

// export function Sidebar({
//   isOpen,
//   toggleSidebar,
// }: {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }) {
//   return (
//     <div
//       className={`fixed left-0 top-0 h-screen bg-[#DD8560] text-white p-8 flex flex-col transition-transform ${
//         isOpen ? "translate-x-0" : "-translate-x-full"
//       } w-[300px] min-w-[250px] md:w-[250px] sm:w-[200px] sm:min-w-[200px]`}
//       style={{
//         zIndex: isOpen ? 50 : 0,
//       }}
//     >
//       <button
//         className="absolute top-4 right-4 md:hidden cursor-pointer"
//         onClick={toggleSidebar}
//       >
//         <ArrowLeft className="w-6 h-6" />
//       </button>
//       <div className="mb-16 mt-4">
//         <img
//           src={ModellaLogo || "/placeholder.png"}
//           alt="Modella Logo"
//           className="w-32 h-auto mx-auto"
//         />
//       </div>
//       <nav className="space-y-8 mt-4 font-medium">
//         <NavItem icon={Compass} label="Explore" to="/" />
//         <hr className="border-t border-white/50" />
//         <NavItem icon={Layout} label="Swipe Page" to="/swipe" />
//         <hr className="border-t border-white/50" />
//         <NavItem icon={Bookmark} label="Saved List" to="/saved" />
//         <hr className="border-t border-white/50" />
//         <NavItem icon={MessageCircle} label="Chats" to="/chats" />
//         <hr className="border-t border-white/50" />
//         <NavItem icon={User} label="Account" to="/account" />
//         <hr className="border-t border-white/50" />
//         <NavItem icon={Settings} label="Settings" to="/settings" />
//       </nav>
//     </div>
//   );
// }

// function NavItem({
//   icon: Icon,
//   label,
//   to,
// }: {
//   icon: any;
//   label: string;
//   to: string;
// }) {
//   return (
//     <a
//       href={to}
//       className="flex items-center space-x-4 text-lg hover:opacity-80 transition-opacity"
//     >
//       <Icon className="w-6 h-6" />
//       <span>{label}</span>
//     </a>
//   );
// }

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
      className={`fixed left-0 top-0 h-screen bg-[#DD8560] text-white flex flex-col transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-[300px] min-w-[250px] md:w-[250px] sm:w-[200px] sm:min-w-[200px] overflow-y-auto`}
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

        <nav className="flex-1 flex flex-col justify-start space-y-2 mt-4 font-medium min-h-0">
          <div className="py-4">
            <NavItem icon={Compass} label="Explore" to="/" />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem icon={Layout} label="Swipe Page" to="/swipe" />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem icon={Bookmark} label="Saved List" to="/saved" />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem icon={MessageCircle} label="Chats" to="/chats" />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem icon={User} label="Account" to="/account" />
          </div>
          <hr className="border-t border-white/50" />
          <div className="py-4">
            <NavItem icon={Settings} label="Settings" to="/settings" />
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
}: {
  icon: any;
  label: string;
  to: string;
}) {
  return (
    <a
      href={to}
      className="flex items-center space-x-4 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
    >
      <Icon className="w-6 h-6" />
      <span className="text-lg">{label}</span>
    </a>
  );
}
