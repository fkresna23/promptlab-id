// Konfigurasi ini sekarang akan berfungsi dengan benar untuk lokal dan produksi
const API_BASE_URL = import.meta.env.PROD ? "/api" : "http://localhost:5001";

const handleResponse = async (response: Response) => {
  // Jika respons tidak ada isinya (seperti pada 204 No Content), jangan coba parse JSON
  if (response.status === 204) {
    return null;
  }
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

// --- INTERFACES --- (tetap sama)
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

// --- API FUNCTIONS --- (sekarang menggunakan base URL yang benar)
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse(response);
};

export const getPromptsByCategory = async (
  categoryId: string
): Promise<Prompt[]> => {
  const response = await fetch(
    `${API_BASE_URL}/prompts/category/${categoryId}`
  );
  return handleResponse(response);
};

export const getPromptById = async (promptId: string): Promise<Prompt> => {
  const response = await fetch(`${API_BASE_URL}/prompts/${promptId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const registerUser = async (userData: UserData): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getAllPrompts = async (): Promise<Prompt[]> => {
  const response = await fetch(`${API_BASE_URL}/prompts/all`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createPrompt = async (promptData: PromptData): Promise<Prompt> => {
  const response = await fetch(`${API_BASE_URL}/prompts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(promptData),
  });
  return handleResponse(response);
};
