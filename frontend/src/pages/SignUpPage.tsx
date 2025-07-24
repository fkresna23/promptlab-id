import { useState } from "react";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}
interface SignUpPageProps {
  setCurrentPage: (page: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.863 44 24c0-1.341-.138-2.65-.389-3.917z"
    ></path>
  </svg>
);

const SignUpPage: React.FC<SignUpPageProps> = ({
  setCurrentPage,
  setUserInfo,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal membuat akun.");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data);
      setCurrentPage("home");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="hidden md:flex justify-center">
        <img
          src="/assets/signup-image.png"
          alt="Ilustrasi Sign Up"
          className="max-w-md w-full"
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/600x400/111111/FFFFFF?text=Gambar+Anda")
          }
        />
      </div>
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-gray-600 mb-6">
          Please complete the form below to create your account.
        </p>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name*
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
              id="fullName"
              type="text"
              placeholder="Nama Lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address*
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
              id="email"
              type="email"
              placeholder="email@anda.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password*
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
              id="password"
              type="password"
              placeholder="Buat password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:bg-gray-400"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors">
            <GoogleIcon /> Continue with Google
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <button
            onClick={() => setCurrentPage("login")}
            className="font-bold text-black hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
