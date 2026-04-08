import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fallbackProperties } from "../../data/fallback-properties";
import { useLanguage } from "../../contexts/LanguageContext";
import PropertyCard from "../property/PropertyCard";

export default function FeaturedRentals() {
  const { t } = useLanguage();
  const properties = fallbackProperties.filter((p) => p.status === "listed").slice(0, 4);

  return (
    <section className="py-24 bg-background">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
              {t("nav.rentals")}
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-3">
              {t("rentals.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">{t("rentals.subtitle")}</p>
          </div>
          <Link
            to="/rentals"
            className="hidden md:inline-flex items-center gap-2 text-ocean hover:text-sunset font-medium transition-colors group"
          >
            {t("rentals.viewAll")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/rentals"
            className="inline-flex items-center gap-2 text-ocean hover:text-sunset font-medium"
          >
            {t("rentals.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
