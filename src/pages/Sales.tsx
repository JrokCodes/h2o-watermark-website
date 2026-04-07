import { useState, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { salesListings } from "../data/sales-listings";
import PropertyCard from "../components/property/PropertyCard";

export default function Sales() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"available" | "all">("available");

  const sorted = useMemo(() => {
    // Always show available first, sold last
    const sortedAll = [...salesListings].sort((a, b) => {
      if (a.status === "listed" && b.status !== "listed") return -1;
      if (a.status !== "listed" && b.status === "listed") return 1;
      return (b.price || 0) - (a.price || 0);
    });
    if (filter === "available") return sortedAll.filter((p) => p.status === "listed");
    return sortedAll;
  }, [filter]);

  const availableCount = salesListings.filter((p) => p.status === "listed").length;
  const soldCount = salesListings.filter((p) => p.status === "sold").length;

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

      <section className="py-6 bg-cream sticky top-20 z-30 border-b border-border">
        <div className="container-custom flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={() => setFilter("available")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "available"
                ? "bg-sunset text-white"
                : "bg-white text-foreground border border-border hover:border-sunset"
            }`}
          >
            For Sale ({availableCount})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-ocean text-white"
                : "bg-white text-foreground border border-border hover:border-ocean"
            }`}
          >
            Show Sold Too ({availableCount + soldCount})
          </button>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {sorted.length} {sorted.length === 1 ? "listing" : "listings"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
