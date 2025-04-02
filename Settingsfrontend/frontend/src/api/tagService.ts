const API_URL = "/api/v1/tags";

export const createTag = async (name: string, userId: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: crypto.randomUUID(), name, user_id: userId }),
  });
  if (!response.ok) throw new Error("Failed to create tag");
};

export const deleteTag = async (tagId: string) => {
  const response = await fetch(`${API_URL}/${tagId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete tag");
};
