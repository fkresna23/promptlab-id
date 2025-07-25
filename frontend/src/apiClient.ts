const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }
  return data;
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  return handleResponse(response);
};

export const getPromptsByCategory = async (categoryId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/prompts/category/${categoryId}`
  );
  return handleResponse(response);
};

export const getPromptById = async (promptId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/prompts/${promptId}`);
  return handleResponse(response);
};

export const registerUser = async (userData: object) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials: object) => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};
