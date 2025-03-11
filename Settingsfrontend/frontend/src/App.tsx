import { useEffect, useState } from "react";
import "./App.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User, Tag, Preference } from "./models";
import { UserService, TagService, PreferenceService } from "./services";

function SettingsPage() {
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
      const userData = await UserService.getUser();
      setUser(userData.user);
      setTags(userData.tags);
      setPreferences(userData.preferences);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;
    try {
      await UserService.updateUser(user);
      toast({ title: "Success", description: "User details updated" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateTag = async () => {
    if (!newTag || !user) return;
    try {
      await TagService.createTag(newTag, user.id);
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
      await UserService.deleteUser(user.id);
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

export default SettingsPage;
