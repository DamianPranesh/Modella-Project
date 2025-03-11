import { useState, useEffect } from "react";
import SettingsMenu from "../components/Settingsmenu";
import { getUser } from "../api/userService";

type User = { id: string; name: string; email: string };

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const data = await getUser(userId || "");
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div className="flex">
      <SettingsMenu />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Account</h1>
        {user && (
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
