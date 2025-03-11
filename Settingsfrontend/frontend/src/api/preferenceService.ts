const API_URL = "/api/v1/preferences";

export const createPreference = async (name: string, userId: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: crypto.randomUUID(), name, user_id: userId }),
  });
  if (!response.ok) throw new Error("Failed to create preference");
};

export const deletePreference = async (preferenceId: string) => {
  const response = await fetch(`${API_URL}/${preferenceId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete preference");
};
