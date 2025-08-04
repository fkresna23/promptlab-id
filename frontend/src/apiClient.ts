const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan pada server");
  }
  return data;
};

// Extended interfaces for better type safety
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
  promptText: string;
  isPremium?: boolean;
  category?: string;
  tags?: string[];
  keySentence?: string;
  whatItDoes?: string[];
  tips?: string[];
  howToUse?: string[];
  createdAt?: string;
  updatedAt?: string;
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

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// API Functions
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  return handleResponse(response);
};

export const getPromptsByCategory = async (
  categoryId: string
): Promise<Prompt[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/prompts/category/${categoryId}`
  );
  return handleResponse(response);
};

export const getPromptById = async (promptId: string): Promise<Prompt> => {
  const response = await fetch(`${API_BASE_URL}/api/prompts/${promptId}`, {
    headers: getAuthHeaders(), // Gunakan helper di sini
  });
  return handleResponse(response);
};

export const registerUser = async (userData: UserData): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<UserInfo> => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Search and filter functions (can be expanded later)
export const searchPrompts = async (
  query: string,
  filters?: {
    category?: string;
    isPremium?: boolean;
    tags?: string[];
  }
): Promise<Prompt[]> => {
  const params = new URLSearchParams();
  params.append("q", query);

  if (filters?.category) params.append("category", filters.category);
  if (filters?.isPremium !== undefined)
    params.append("premium", filters.isPremium.toString());
  if (filters?.tags) params.append("tags", filters.tags.join(","));

  const response = await fetch(`${API_BASE_URL}/api/prompts/search?${params}`);
  return handleResponse(response);
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
