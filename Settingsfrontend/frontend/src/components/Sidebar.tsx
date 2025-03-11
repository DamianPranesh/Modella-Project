import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-orange-400 h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Modella</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/explore">Explore</Link>
        <Link to="/swipe">Swipe Page</Link>
        <Link to="/saved">Saved List</Link>
        <Link to="/chats">Chats</Link>
        <Link to="/account">Account</Link>
        <Link to="/settings" className="font-bold">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
