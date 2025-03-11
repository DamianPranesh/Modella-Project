import { Link } from "react-router-dom";

const SettingsMenu = () => {
  return (
    <div className="w-1/4 p-6 border-r border-gray-300">
      <h2 className="text-2xl font-bold text-[#D4825E] mb-6">Settings</h2>
      <ul className="space-y-3 font-medium text-lg">
        <li><Link to="/settings/privacy">Privacy</Link></li>
        <li><Link to="/settings/activity">Activity</Link></li>
        <li><Link to="/settings/notifications">Notification</Link></li>
        <li><Link to="/settings/friends">Friends</Link></li>
        <li><Link to="/settings/portfolio">Portfolio</Link></li>
        <li><Link to="/settings/favorite">Favorite</Link></li>
        <li><Link to="/settings/edit-account">Edit Account</Link></li>
      </ul>
    </div>
  );
};

export default SettingsMenu;
