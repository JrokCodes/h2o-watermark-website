import { useLanguage } from "../contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

export default function Sales() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            {t("nav.sales")}
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            {t("sales.title")}
          </h1>
          <p className="text-xl text-white/80">{t("sales.subtitle")}</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-playfair text-3xl mb-4">For Sale Listings</h2>
          <p className="text-muted-foreground mb-8">
            We're integrating our sales inventory into the new system. In the meantime,
            view our active listings on Zillow or contact Christine directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.zillow.com/profile/H2OWatermark"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-ocean text-white rounded-xl font-semibold"
            >
              View on Zillow <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("openChat"))}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-sunset text-white rounded-xl font-semibold"
            >
              {t("chat.button")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
