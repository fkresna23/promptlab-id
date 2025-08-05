const API_BASE_URL = import.meta.env.PROD
  ? "/api"
  : "http://localhost:5001/api";

const handleResponse = async (response: Response) => {
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }
  return data;
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const userInfoString = localStorage.getItem("userInfo");
  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString);
    if (userInfo.token) {
      headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
  }
  return headers;
};

// --- INTERFACES ---
export interface Category {
  _id: string;
  title: string;
  icon: string;
  count: number;
  isNew?: boolean;
}
export interface Prompt {
  _id: string;
  title: string;
  description: string;
  promptText: string;
  isPremium: boolean;
  category?: Category | string;
  tags?: string[];
  keySentence?: string;
  whatItDoes?: string[];
  tips?: string[];
  howToUse?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
  role: "user" | "premium" | "admin";
}
export interface UserData {
  name: string;
  email: string;
  password: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface PromptData {
  title: string;
  description: string;
  promptText: string;
  category: string;
  isPremium: boolean;
  whatItDoes?: string[];
  tips?: string[];
  howToUse?: string[];
}

// --- API FUNCTIONS ---
export const getCategories = async (): Promise<Category[]> =>
  fetch(`${API_BASE_URL}/categories`).then(handleResponse);
export const getPromptsByCategory = (categoryId: string): Promise<Prompt[]> =>
  fetch(`${API_BASE_URL}/prompts/category/${categoryId}`).then(handleResponse);
export const getPromptById = (promptId: string): Promise<Prompt> =>
  fetch(`${API_BASE_URL}/prompts/${promptId}`, {
    headers: getAuthHeaders(),
  }).then(handleResponse);
export const registerUser = (userData: UserData): Promise<UserInfo> =>
  fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then(handleResponse);
export const loginUser = (credentials: LoginCredentials): Promise<UserInfo> =>
  fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then(handleResponse);
export const getAllPrompts = (): Promise<Prompt[]> =>
  fetch(`${API_BASE_URL}/prompts/all`, { headers: getAuthHeaders() }).then(
    handleResponse
  );
export const createPrompt = (promptData: PromptData): Promise<Prompt> =>
  fetch(`${API_BASE_URL}/prompts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(promptData),
  }).then(handleResponse);
