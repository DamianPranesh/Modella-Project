const API_URL = "/api/v1/users";

export const getUser = async (userId: string) => {
  const response = await fetch(`${API_URL}/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user data");
  return response.json();
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to update user");
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_URL}/${userId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete user");
};
