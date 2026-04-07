import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatWidget from "./components/chat/ChatWidget";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Sales from "./pages/Sales";
import PropertyManagement from "./pages/PropertyManagement";
import About from "./pages/About";
import Areas from "./pages/Areas";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/property-management" element={<PropertyManagement />} />
              <Route path="/about" element={<About />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
