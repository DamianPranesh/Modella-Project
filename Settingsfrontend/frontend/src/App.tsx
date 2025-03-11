import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SettingsPage from "./pages/SettingsPage";
import Privacy from "./features/Privacy";
import Activity from "./features/Activity";
import Notification from "./features/Notification";
import Friends from "./features/Friends";
import Portfolio from "./features/Portfolio";
import Favorite from "./features/Favorite";
import EditAccount from "./features/EditAccount";

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
