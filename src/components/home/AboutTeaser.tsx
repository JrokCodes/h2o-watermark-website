import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function AboutTeaser() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Photo */}
          <div className="relative max-w-sm mx-auto lg:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-cream">
              <img
                src="/images/christine.jpg"
                alt="Christine Kim, J.D. — Broker"
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Floating credential badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl max-w-[220px]">
              <div className="text-3xl font-playfair font-semibold text-ocean-dark">15+</div>
              <div className="text-sm text-muted-foreground">Years serving Oahu since 2011</div>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
              {t("about.subtitle")}
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-6">
              {t("about.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t("about.bio")}</p>

            {/* Philosophy quote */}
            <div className="relative pl-6 border-l-4 border-sunset mb-8 py-2">
              <Quote className="absolute -top-2 -left-3 h-6 w-6 text-sunset bg-cream" />
              <p className="font-playfair text-lg italic text-foreground/80">
                "{t("about.quote")}"
              </p>
              <p className="text-xs text-muted-foreground mt-2">— Christine Kim, J.D.</p>
            </div>

            <p className="text-sm text-muted-foreground mb-8">{t("about.credentials")}</p>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ocean hover:bg-ocean-dark text-white rounded-lg font-medium transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              {t("about.learnMore")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
