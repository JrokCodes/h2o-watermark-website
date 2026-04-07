import { useState, useMemo } from "react";
import { fallbackProperties } from "../data/fallback-properties";
import { salesListings } from "../data/sales-listings";
import PropertyCard from "../components/property/PropertyCard";

const AREAS = [
  { value: "", label: "All Areas" },
  { value: "waikiki", label: "Waikiki" },
  { value: "hawaii_kai", label: "Hawaii Kai" },
  { value: "ala_moana", label: "Ala Moana" },
  { value: "kailua", label: "Kailua" },
  { value: "kaneohe", label: "Kaneohe" },
  { value: "aiea", label: "Aiea" },
  { value: "eva_beach", label: "Eva Beach" },
  { value: "mililani", label: "Mililani" },
  { value: "downtown", label: "Downtown" },
];

export default function Search() {
  const [type, setType] = useState<"all" | "rent" | "sale">("all");
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available">("available");

  const all = useMemo(() => {
    let combined = [
      ...(type !== "sale" ? fallbackProperties : []),
      ...(type !== "rent" ? salesListings : []),
    ];
    if (area) combined = combined.filter((p) => p.area === area);
    if (beds) combined = combined.filter((p) => (p.beds || 0) >= parseInt(beds));
    if (maxPrice) {
      const max = parseInt(maxPrice);
      combined = combined.filter((p) => {
        const price = p.rentPrice || p.price || 0;
        return price <= max;
      });
    }
    if (statusFilter === "available") {
      combined = combined.filter((p) => p.status === "listed");
    }
    return combined;
  }, [type, area, beds, maxPrice, statusFilter]);

  return (
    <div>
      <section className="gradient-ocean text-white py-20">
        <div className="container-custom text-center">
          <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-3">Search</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-semibold mb-4">Find Properties</h1>
          <p className="text-xl text-white/80">
            Search rentals and sales across our entire portfolio
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-cream sticky top-20 z-30 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm"
            >
              <option value="all">Rent or Sale</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm"
            >
              {AREAS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm"
            >
              <option value="">Any beds</option>
              <option value="1">1+ beds</option>
              <option value="2">2+ beds</option>
              <option value="3">3+ beds</option>
              <option value="4">4+ beds</option>
            </select>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm"
            >
              <option value="available">Available Now</option>
              <option value="all">Show All</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-background">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {all.length} {all.length === 1 ? "property" : "properties"}
          </p>
          {all.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No properties match your filters. Try adjusting them.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {all.map((p) => (
                <PropertyCard key={`${p.listingType}-${p.id}`} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
