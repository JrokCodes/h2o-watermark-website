import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-ocean-dark text-white mt-20">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-playfair text-xl font-bold">
                H₂O
              </div>
              <div>
                <div className="font-playfair text-xl font-semibold">H2O Watermark</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Pacific Properties LLC</div>
              </div>
            </div>
            <p className="text-white/80 italic font-playfair text-lg mb-4">"{t("footer.tagline")}"</p>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              Premier real estate sales, rentals, and property management across Oahu. Serving Honolulu since 2011.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://facebook.com/H2oWatermarkPacificPropertiesLlc" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-sunset transition-colors flex items-center justify-center text-sm font-bold">
                f
              </a>
              <a href="https://www.zillow.com/profile/H2OWatermark" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-sunset transition-colors flex items-center justify-center text-xs font-bold">
                Z
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/rentals" className="hover:text-sunset transition-colors">{t("nav.rentals")}</Link></li>
              <li><Link to="/sales" className="hover:text-sunset transition-colors">{t("nav.sales")}</Link></li>
              <li><Link to="/property-management" className="hover:text-sunset transition-colors">{t("nav.propertyManagement")}</Link></li>
              <li><Link to="/about" className="hover:text-sunset transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/areas" className="hover:text-sunset transition-colors">{t("nav.areas")}</Link></li>
              <li><Link to="/contact" className="hover:text-sunset transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4 text-white">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-sunset" />
                <a href="tel:8086502382" className="hover:text-sunset transition-colors">(808) 650-2382</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-sunset" />
                <a href="mailto:info@h2owatermark.com" className="hover:text-sunset transition-colors break-all">
                  info@h2owatermark.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-sunset" />
                <span>
                  1314 S. King St. #718<br />
                  Honolulu, HI 96814
                </span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <h5 className="text-xs uppercase tracking-wider text-white/50 mb-2">{t("footer.languages")}</h5>
              <p className="text-xs text-white/70">English · 한국어 · 日本語 · 中文</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">{t("footer.rights")}</p>
          <p className="text-xs text-white/60">{t("footer.license")} · License #RB-20727, RB-20728</p>
        </div>
      </div>
    </footer>
  );
}
