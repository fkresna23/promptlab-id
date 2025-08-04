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
import AdminDashboardPage from "./pages/AdminDashboardPage";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

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
    if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
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
      case "adminDashboard":
        // Pastikan hanya admin yang bisa akses, jika tidak, lempar ke halaman utama
        if (userInfo?.role !== "admin") {
          setCurrentPage("home");
          return null; // atau return <HomePage />;
        }
        return (
          <div className="bg-gray-100 min-h-screen">
            <AdminDashboardPage />
          </div>
        );

      case "signup":
    }
  };

  return (
    <div className="min-h-screen">
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
