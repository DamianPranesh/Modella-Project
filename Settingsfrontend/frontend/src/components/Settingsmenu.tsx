import { Link } from "react-router-dom";

const SettingsMenu = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-500 mb-4">Settings</h2>
      <ul className="space-y-3 text-lg">
        <li><Link to="/settings/privacy">Privacy</Link></li>
        <li><Link to="/settings/activity">Activity</Link></li>
        <li><Link to="/settings/notification">Notification</Link></li>
        <li><Link to="/settings/friends">Friends</Link></li>
        <li><Link to="/settings/portfolio">Portfolio</Link></li>
        <li><Link to="/settings/favorite">Favorite</Link></li>
        <li><Link to="/settings/edit-account">Edit Account</Link></li>
      </ul>
    </div>
  );
};

export default SettingsMenu;
