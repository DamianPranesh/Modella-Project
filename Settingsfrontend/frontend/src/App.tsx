import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await fetch(`/api/v1/users/${userId}`);
      const data = await response.json();
      setUser(data.user);
      setTags(data.tags);
      setPreferences(data.preferences);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch user data", status: "error" });
    }
  };

  const handleUpdateUser = async () => {
    try {
      await fetch(`/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      toast({ title: "Success", description: "User details updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user details" });
    }
  };

  const handleCreateTag = async (newTag) => {
    try {
      await fetch(`/api/v1/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });
      fetchUserData();
      toast({ title: "Success", description: "Tag created" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create tag" });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await fetch(`/api/v1/users/${user.id}`, { method: "DELETE" });
      toast({ title: "Account Deleted", description: "Your account has been deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete account" });
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
            <Button onClick={handleUpdateUser} className="mt-2">Update User</Button>
            <Button onClick={handleDeleteUser} className="mt-2 bg-red-500">Delete Account</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}