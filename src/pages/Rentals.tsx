import { useEffect, useState } from "react";
import type { Property } from "../lib/types";
import { fetchProperties } from "../lib/api";
import { useLanguage } from "../contexts/LanguageContext";
import PropertyCard from "../components/property/PropertyCard";

export default function Rentals() {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties({ status: "listed" }).then((p) => {
      setProperties(p);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Page header */}
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

      {/* Listings */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center text-muted-foreground">No rentals available right now.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
