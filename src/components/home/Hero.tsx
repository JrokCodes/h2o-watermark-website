import { Star, Phone } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Deep teal background fallback (matches IntelleQ BM) */}
      <div className="absolute inset-0 bg-[#0f2b36]" />

      {/* Background image — tropical apartment living */}
      <img
        src="/images/hero-tropical.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* IntelleQ BM teal gradient overlay — from-[#0f2b36]/95 via-[#1a4050]/85 to-[#2A9D8F]/50 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2b36]/95 via-[#1a4050]/85 to-[#2A9D8F]/50" />

      {/* Subtle bottom darken for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f2b36]/40" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white py-24">
        {/* Pre-headline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A9D8F]/25 backdrop-blur-sm border border-[#2A9D8F]/50 mb-6 animate-fade-in">
          <span className="text-xs uppercase tracking-[0.2em] text-white font-medium">
            {t("hero.preTitle")}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 leading-tight animate-fade-in">
          {t("hero.title")}
          <br />
          <span className="text-[#5fd4c4] italic">{t("hero.titleAccent")}</span>
          <br />
          {t("hero.titleEnd")}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/90 mb-2 max-w-2xl mx-auto font-light">
          {t("hero.subtitle")}
        </p>
        <p className="text-sm sm:text-base text-white/70 mb-10">{t("hero.subtitleAlt")}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/rentals"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#2A9D8F] hover:bg-[#238a7d] text-white rounded-lg font-semibold text-base shadow-2xl shadow-[#2A9D8F]/30 transition-all hover:-translate-y-1"
          >
            {t("hero.browseProperties")}
          </a>
          <button
            onClick={() => {
              const event = new CustomEvent("openChat");
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/40 hover:border-white hover:bg-white/20 text-white rounded-lg font-semibold text-base transition-all hover:-translate-y-1"
          >
            {t("hero.talkToAmy")}
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-white/80">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span>{t("hero.badge1")}</span>
          </div>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span>{t("hero.badge3")}</span>
        </div>
      </div>

      {/* Floating phone tag */}
      <a
        href="tel:8086502382"
        className="absolute bottom-8 right-8 hidden lg:flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-medium hover:bg-white hover:text-ocean-dark transition-all animate-bounce-slow"
      >
        <Phone className="h-4 w-4" />
        <span>(808) 650-2382</span>
      </a>

      {/* Trust badges — bottom left */}
      <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl">
        <img src="/images/badges/bot_logo1.png" alt="Realtor" className="h-10 w-auto" />
        <img src="/images/badges/bot_logo2.png" alt="Equal Housing Opportunity" className="h-10 w-auto" />
        <img src="/images/badges/bot_logo3.png" alt="MLS" className="h-10 w-auto" />
      </div>
    </section>
  );
}
