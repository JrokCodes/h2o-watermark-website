import { Star, Phone } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Solid dark background while video loads */}
      <div className="absolute inset-0 bg-ocean-dark" />

      {/* Background video — buildings */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Warm color overlay for extra warmth */}
      <div className="absolute inset-0 bg-gradient-to-b from-sunset/10 via-transparent to-ocean-dark/40" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white py-24">
        {/* Pre-headline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunset/20 backdrop-blur-sm border border-sunset/30 mb-6 animate-fade-in">
          <span className="text-xs uppercase tracking-[0.2em] text-white font-medium">
            {t("hero.preTitle")}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 leading-tight animate-fade-in">
          {t("hero.title")}
          <br />
          <span className="text-sunset italic">{t("hero.titleAccent")}</span>
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
            className="inline-flex items-center justify-center px-8 py-4 bg-sunset hover:bg-sunset-dark text-white rounded-lg font-semibold text-base shadow-2xl transition-all hover:-translate-y-1 hover:shadow-coral"
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
          <span>{t("hero.badge2")}</span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span>{t("hero.badge3")}</span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span>{t("hero.badge4")}</span>
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
    </section>
  );
}
