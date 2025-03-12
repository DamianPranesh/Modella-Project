import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SettingsPage from "./Pages/SettingsPage";
import Privacy from "./Features/Privacy";
import Activity from "./Features/Activity";
import Notification from "./Features/Notification";
import Friends from "./Features/Friends";
import Portfolio from "./Features/Portfolio";
import Favorite from "./Features/Favorite";
import EditAccount from "./Features/EditAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/settings" element={<SettingsPage />}>
          <Route path="privacy" element={<Privacy />} />
          <Route path="activity" element={<Activity />} />
          <Route path="notification" element={<Notification />} />
          <Route path="friends" element={<Friends />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="edit-account" element={<EditAccount />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
