import {
  Compass,
  Layout,
  Bookmark,
  MessageCircle,
  User,
  Settings,
} from "lucide-react";
import ModellaLogo from "../images/Image-7.png";

export function Sidebar() {
  return (
    <div className="w-[300px] min-w-[250px] bg-[#DD8560] text-white p-8 flex flex-col fixed left-0 top-0 h-screen md:w-[250px] sm:w-[200px] sm:min-w-[200px]">
      <div className="mb-16 flex justify-center">
        <img
          src={ModellaLogo || "/placeholder.png"}
          alt="Modella Logo"
          className="w-32 h-auto"
        />
      </div>
      <nav className="space-y-6">
        <NavItem icon={Compass} label="Explore" />
        <NavItem icon={Layout} label="Swipe Page" />
        <NavItem icon={Bookmark} label="Saved List" />
        <NavItem icon={MessageCircle} label="Chats" />
        <NavItem icon={User} label="Account" />
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
