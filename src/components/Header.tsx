import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, Star } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.rentals"), path: "/rentals" },
    { name: t("nav.sales"), path: "/sales" },
    { name: t("nav.search"), path: "/search" },
    { name: t("nav.developments"), path: "/developments" },
    { name: t("nav.news"), path: "/news" },
    { name: t("nav.resources"), path: "/resources" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <>
      {/* Top bar — only visible at top of page */}
      <div
        className={`bg-ocean-dark text-white text-xs transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0" : "max-h-12"
        }`}
      >
        <div className="container-custom flex items-center justify-between py-2.5">
          <div className="flex items-center gap-4">
            <a href="tel:8086502382" className="flex items-center gap-1.5 hover:text-sunset transition-colors">
              <Phone className="h-3 w-3" />
              <span>(808) 650-2382</span>
            </a>
            <a href="mailto:info@h2owatermark.com" className="hidden sm:flex items-center gap-1.5 hover:text-sunset transition-colors">
              <Mail className="h-3 w-3" />
              <span>info@h2owatermark.com</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span>{t("topbar.rating")}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/images/h2o-logo-original.jpg"
                alt="H2O Watermark Pacific Properties — Hawaii Homes to Opportunities"
                className="h-14 w-auto group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-sunset"
                      : "text-foreground hover:text-sunset"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sunset rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher />
              <a
                href="tel:8086502382"
                className="px-5 py-2 bg-sunset hover:bg-sunset-dark text-white rounded-lg font-medium text-sm shadow-coral transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {t("nav.callUs")}
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-border animate-fade-in">
            <nav className="container-custom py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-3 text-foreground hover:bg-ocean/5 hover:text-ocean rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                <LanguageSwitcher />
                <a
                  href="tel:8086502382"
                  className="px-5 py-2 bg-sunset text-white rounded-lg font-medium text-sm"
                >
                  (808) 650-2382
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
