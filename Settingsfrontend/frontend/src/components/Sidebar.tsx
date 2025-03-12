import { Link } from "react-router-dom";
import './components/Sidebar.css';
const Sidebar = () => {
  return (
    <div className="sidebar">
    <div className="logo">
      <h1>Modella</h1>
    </div>
    
    <nav className="sidebar-nav">
      <div className="nav-item">
        <span className="icon">M</span>
        <li><Link to="/">Explore</Link></li>
      </div>
      
      <div className="nav-item">
        <span className="icon">⟳</span>
        <li><Link to="/">Swipe Page</Link></li>
      </div>
      
      <div className="nav-item">
        <span className="icon">□</span>
        <li><Link to="/">Saved List</Link></li>
      </div>
      
      <div className="nav-item">
        <span className="icon">💬</span>
        <li><Link to="/">Chats</Link></li>
      </div>
      
      <div className="nav-item">
        <span className="icon">👤</span>
        <li><Link to="/">Account</Link></li>
      </div>
      
      <div className="nav-item active">
        <span className="icon">⚙️</span>
        <li><Link to="/settings" className="font-bold">Settings</Link></li>
      </div>
    </nav>
  </div>
  );
};

export default Sidebar;
