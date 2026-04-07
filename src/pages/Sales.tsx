import { useLanguage } from "../contexts/LanguageContext";
import { salesListings } from "../data/sales-listings";
import PropertyCard from "../components/property/PropertyCard";

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

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {salesListings.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
