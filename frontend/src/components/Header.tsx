import { useState, useEffect, useRef } from "react";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const ProfileMenuIcon = () => (
  <svg
    xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  userInfo: UserInfo | null;
  logoutHandler: () => void;
}

const Header: React.FC<HeaderProps> = ({
  setCurrentPage,
  userInfo,
  logoutHandler,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleNav = (page: string) => {
    setCurrentPage(page);
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-[#111111] text-white relative z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <button
            onClick={() => handleNav("home")}
            className="flex items-center space-x-2"
          >
            <img
              src="/assets/nama-logo-anda.png"
              alt="Logo Situs"
              className="h-8 md:h-10"
              onError={(e) => {
                e.currentTarget.src =
                  "[https://placehold.co/40x40/FFFFFF/000000?text=Logo](https://placehold.co/40x40/FFFFFF/000000?text=Logo)";
              }}
            />
            <span className="font-bold text-lg">&gt; _</span>
          </button>
        </div>
        <div className="hidden md:flex flex-grow justify-center">
          <ul className="flex items-center space-x-6">
            <li>
              <button
                onClick={() => handleNav("home")}
                className="hover:text-yellow-400"
              >
                Prompts
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav("offerings")}
                className="hover:text-yellow-400"
              >
                Bundles
              </button>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
          {userInfo ? (
            <div className="relative" ref={menuRef}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={logoutHandler}
                  className="hover:text-yellow-400"
                >
                  Log out
                </button>
                <div className="w-px h-6 bg-gray-600"></div>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <ProfileMenuIcon />
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${userInfo.name.replace(
                      " ",
                      "+"
                    )}&background=random`}
                    alt="User avatar"
                  />
                </button>
              </div>
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-lg text-black p-2">
                  <div className="px-4 py-2 border-b">
                    <p className="font-bold">{userInfo.name}</p>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                  </div>
                  <ul className="py-2">
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                        My Profile
                      </button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md">
                        My Products
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={logoutHandler}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNav("login")}
                className="hover:text-yellow-400"
              >
                Login
              </button>
              <button
                onClick={() => handleNav("signup")}
                className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </div>
        {/* ... Tombol Hamburger Mobile ... */}
      </nav>
    </header>
  );
};

export default Header;
