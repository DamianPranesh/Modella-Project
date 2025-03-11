import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-orange-400 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Modella</h1>
      <ul className="space-y-4">
        <li><Link to="/">Explore</Link></li>
        <li><Link to="/">Swipe Page</Link></li>
        <li><Link to="/">Saved List</Link></li>
        <li><Link to="/">Chats</Link></li>
        <li><Link to="/">Account</Link></li>
        <li><Link to="/settings" className="font-bold">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
