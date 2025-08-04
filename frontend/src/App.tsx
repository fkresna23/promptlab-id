import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CategoryList from "./components/CategoryList";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import PromptsListPage from "./pages/PromptsListPage";
import PromptDetailPage from "./pages/PromptDetailPage";
import OfferingsPage from "./pages/OfferingsPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyProductsPage from "./pages/MyProductsPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"; // <-- PERBARUI PATH INI
import { type UserInfo } from "./apiClient";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
        localStorage.removeItem("userInfo");
      }
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setCurrentPage("home");
  };

  const handleCategoryClick = (id: string, name: string) => {
    setSelectedCategory({ id, name });
    setCurrentPage("promptsList");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "offerings":
        return <OfferingsPage userInfo={userInfo} />;
      case "contact":
        return (
          <div className="bg-white">
            <ContactPage />
          </div>
        );
      case "myProfile":
        return (
          <div className="bg-[#F3F3F3] py-10">
            <MyProfilePage userInfo={userInfo} />
          </div>
        );
      case "myProducts":
        return (
          <div className="bg-[#F3F3F3] py-10">
            <MyProductsPage />
          </div>
        );
      case "adminDashboard":
        if (userInfo?.role !== "admin") {
          setCurrentPage("home");
          return null; // Atau tampilkan halaman "Tidak Diizinkan"
        }
        return (
          <div className="bg-gray-100 min-h-screen">
            <AdminDashboardPage />
          </div>
        );
      case "signup":
        return (
          <div className="bg-white py-10">
            <SignUpPage
              setCurrentPage={setCurrentPage}
              setUserInfo={setUserInfo}
            />
          </div>
        );
      case "login":
        return (
          <div className="bg-white py-10">
            <LoginPage
              setCurrentPage={setCurrentPage}
              setUserInfo={setUserInfo}
            />
          </div>
        );
      case "promptsList":
        return (
          selectedCategory && (
            <div className="bg-white py-10">
              <PromptsListPage
                selectedCategory={selectedCategory}
                setSelectedPromptId={setSelectedPromptId}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )
        );
      case "promptDetail":
        return (
          selectedPromptId && (
            <div className="bg-white py-10">
              <PromptDetailPage
                promptId={selectedPromptId}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )
        );
      case "home":
      default:
        return (
          <div className="bg-[#F3F3F3]">
            <HeroSection />
            <CategoryList handleCategoryClick={handleCategoryClick} />
          </div>
        );
    }
  };

  return (
    <div>
      <Header
        setCurrentPage={setCurrentPage}
        userInfo={userInfo}
        logoutHandler={logoutHandler}
      />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
