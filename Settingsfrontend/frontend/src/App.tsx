import { useEffect, useState } from "react";
import "./App.css";
import viteLogo from "/vite.svg"; // Import vite logo
import reactLogo from "./assets/react.svg"; // Import react logo
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Ensure correct import path

// Define missing types (replace with actual types from your project)
type User = { id: string; name: string };
type Tag = { id: string; name: string };
type Preference = { id: string; name: string };

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;

// Move SettingsPage to a separate file (SettingsPage.tsx) if needed
export function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newPreference, setNewPreference] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) throw new Error("User ID not found");
      const response = await fetch(`/api/v1/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUser(data.user);
      setTags(data.tags);
      setPreferences(data.preferences);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Failed to update user details");
      toast({ title: "Success", description: "User details updated" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateTag = async () => {
    if (!newTag || !user) return;
    try {
      const response = await fetch(`/api/v1/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), name: newTag, user_id: user.id }),
      });
      if (!response.ok) throw new Error("Failed to create tag");
      setNewTag("");
      fetchUserData();
      toast({ title: "Success", description: "Tag created" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/v1/users/${user.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete account");
      toast({ title: "Account Deleted", description: "Your account has been deleted" });
      setUser(null);
      setTags([]);
      setPreferences([]);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {user && (
        <Card>
          <CardContent>
            <Input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Name"
            />
            <Button onClick={handleUpdateUser} className="mt-2">
              Update User
            </Button>
            <Button onClick={handleDeleteUser} className="mt-2 bg-red-500">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Tags</h2>
        <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New Tag" />
        <Button onClick={handleCreateTag} className="mt-2">
          Add Tag
        </Button>
        {tags.map((tag) => (
          <div key={tag.id} className="flex justify-between mt-2">
            <span>{tag.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
