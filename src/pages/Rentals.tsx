import { useState, useMemo } from "react";
import { fallbackProperties } from "../data/fallback-properties";
import { useLanguage } from "../contexts/LanguageContext";
import PropertyCard from "../components/property/PropertyCard";

export default function Rentals() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"available" | "all">("available");
  const [areaFilter, setAreaFilter] = useState("");

  const filtered = useMemo(() => {
    let result = [...fallbackProperties].sort((a, b) => {
      // Available first
      if (a.status === "listed" && b.status !== "listed") return -1;
      if (a.status !== "listed" && b.status === "listed") return 1;
      return (b.rentPrice || 0) - (a.rentPrice || 0);
    });
    if (filter === "available") {
      result = result.filter((p) => p.status === "listed");
    }
    if (areaFilter) {
      result = result.filter((p) => p.area === areaFilter);
    }
    return result;
  }, [filter, areaFilter]);

  const availableCount = fallbackProperties.filter((p) => p.status === "listed").length;
  const totalCount = fallbackProperties.length;

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">
            {t("nav.rentals")}
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">
            {t("rentals.title")}
          </h1>
          <p className="text-xl text-white/80">{t("rentals.subtitle")}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-cream sticky top-20 z-30 border-b border-border">
        <div className="container-custom flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("available")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "available"
                  ? "bg-sunset text-white"
                  : "bg-white text-foreground border border-border hover:border-sunset"
              }`}
            >
              Available Now ({availableCount})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-ocean text-white"
                  : "bg-white text-foreground border border-border hover:border-ocean"
              }`}
            >
              All ({totalCount})
            </button>
          </div>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-border rounded-xl text-sm"
          >
            <option value="">All Areas</option>
            <option value="waikiki">Waikiki</option>
            <option value="hawaii_kai">Hawaii Kai</option>
            <option value="ala_moana">Ala Moana</option>
            <option value="kailua">Kailua</option>
            <option value="kaneohe">Kaneohe</option>
            <option value="aiea">Aiea</option>
            <option value="eva_beach">Eva Beach</option>
            <option value="mililani">Mililani</option>
            <option value="downtown">Downtown</option>
          </select>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} {filtered.length === 1 ? "property" : "properties"}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              No properties match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
