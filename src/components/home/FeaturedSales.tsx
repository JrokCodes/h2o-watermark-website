import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { salesListings } from "../../data/sales-listings";
import { useLanguage } from "../../contexts/LanguageContext";
import PropertyCard from "../property/PropertyCard";

export default function FeaturedSales() {
  const { t } = useLanguage();
  const featured = salesListings.filter((p) => p.status === "listed").slice(0, 4);

  return (
    <section className="py-24 bg-cream">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
              {t("nav.sales")}
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-3">
              {t("sales.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">{t("sales.subtitle")}</p>
          </div>
          <Link
            to="/sales"
            className="hidden md:inline-flex items-center gap-2 text-ocean hover:text-sunset font-medium transition-colors group"
          >
            {t("sales.viewAll")}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/sales"
            className="inline-flex items-center gap-2 text-ocean hover:text-sunset font-medium"
          >
            {t("sales.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
