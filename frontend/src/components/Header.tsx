import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// Icons Components
const ProfileMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optimize navigation handler
  const handleNav = useCallback(
    (page: string) => {
      setCurrentPage(page);
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    },
    [setCurrentPage]
  );

  // Optimize logout handler
  const handleLogout = useCallback(() => {
    logoutHandler();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [logoutHandler]);

  // Memoize avatar URL to prevent flickering
  const avatarUrl = useMemo(() => {
    if (!userInfo) return "";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userInfo.name
    )}&background=FFD700&color=000000&size=40&bold=true`;
  }, [userInfo?.name]);

  // Navigation items
  const navItems = [
    { label: "Prompts", page: "home" },
    { label: "Bundles", page: "offerings" },
    { label: "Contact Us", page: "contact" },
  ];

  return (
    <header className="bg-[#111111] text-white sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => handleNav("home")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">&gt;</span>
              </div>
              <span className="hidden sm:block font-bold text-xl text-white">
                God of Prompt
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-800"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-800"
                >
                  Log out
                </button>

                <div className="w-px h-6 bg-gray-600"></div>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <ProfileMenuIcon />
                    <div className="relative">
                      {/* Avatar Placeholder */}
                      {!avatarLoaded && (
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-300">
                            {userInfo.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {/* Actual Avatar */}
                      <img
                        className={`w-10 h-10 rounded-full transition-opacity duration-200 ${
                          avatarLoaded
                            ? "opacity-100"
                            : "opacity-0 absolute top-0"
                        }`}
                        src={avatarUrl}
                        alt="User avatar"
                        onLoad={() => setAvatarLoaded(true)}
                        onError={(e) => {
                          setAvatarLoaded(true);
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            userInfo.name.charAt(0)
                          )}&background=6B7280&color=FFFFFF&size=40`;
                        }}
                      />
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 text-black overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="font-bold text-gray-900">
                          {userInfo.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {userInfo.email}
                        </p>
                      </div>
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => handleNav("myProfile")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-3"
                          >
                            <div className="w-5 h-5 text-gray-500">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <span>My Profile</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleNav("myProducts")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-3"
                          >
                            <div className="w-5 h-5 text-gray-500">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <span>My Products</span>
                          </button>
                        </li>
                        <li className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center space-x-3"
                          >
                            <div className="w-5 h-5">
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                            </div>
                            <span>Log out</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNav("login")}
                  className="text-white hover:text-yellow-400 transition-colors duration-200 font-medium px-4 py-2 rounded-md hover:bg-gray-800"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav("signup")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {userInfo && (
              <div className="relative">
                {!avatarLoaded && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-300">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <img
                  className={`w-8 h-8 rounded-full transition-opacity duration-200 ${
                    avatarLoaded ? "opacity-100" : "opacity-0 absolute top-0"
                  }`}
                  src={avatarUrl}
                  alt="User avatar"
                  onLoad={() => setAvatarLoaded(true)}
                  onError={(e) => {
                    setAvatarLoaded(true);
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userInfo.name.charAt(0)
                    )}&background=6B7280&color=FFFFFF&size=32`;
                  }}
                />
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-[#111111]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className="w-full text-left block px-3 py-2 text-white hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200 rounded-md font-medium"
                >
                  {item.label}
                </button>
              ))}

              {userInfo ? (
                <>
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="px-3 py-2">
                      <p className="font-bold text-white">{userInfo.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {userInfo.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNav("myProfile")}
                    className="w-full text-left block px-3 py-2 text-white hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200 rounded-md"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => handleNav("myProducts")}
                    className="w-full text-left block px-3 py-2 text-white hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200 rounded-md"
                  >
                    My Products
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 text-red-400 hover:bg-red-900 hover:bg-opacity-50 transition-colors duration-200 rounded-md"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="border-t border-gray-700 pt-3 mt-3 space-y-2">
                  <button
                    onClick={() => handleNav("login")}
                    className="w-full text-left block px-3 py-2 text-white hover:text-yellow-400 hover:bg-gray-800 transition-colors duration-200 rounded-md font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNav("signup")}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-3 rounded-lg transition-all duration-200 text-center"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
