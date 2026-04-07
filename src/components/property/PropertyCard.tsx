import type { Property } from "../../lib/types";
import { useLanguage } from "../../contexts/LanguageContext";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";

export default function PropertyCard({ property }: { property: Property }) {
  const { t } = useLanguage();
  const price = property.rentPrice
    ? `$${property.rentPrice.toLocaleString()}${t("rentals.perMonth")}`
    : property.price
    ? `$${(property.price / 1000).toFixed(0)}K`
    : "Contact for price";

  const areaDisplay = property.area
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={
            property.imageUrl ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
          }
          alt={property.address}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {property.status === "listed" && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-sunset text-white text-xs font-semibold rounded-full uppercase tracking-wider shadow-lg">
            {t("rentals.available")}
          </span>
        )}
        {property.type === "furnished" && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-white/95 text-ocean-dark text-xs font-semibold rounded-full">
            {t("rentals.furnished")}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-white text-2xl font-playfair font-semibold">{price}</div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-playfair text-xl font-semibold text-foreground mb-2 line-clamp-1">
          {property.address}
          {property.unit && <span className="text-ocean ml-2">{property.unit}</span>}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5" />
          <span>{areaDisplay}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-foreground/70 mb-4">
          {property.beds && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-ocean" />
              <span>{property.beds} {t("rentals.bedrooms")}</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-ocean" />
              <span>{property.baths} {t("rentals.bathrooms")}</span>
            </div>
          )}
          {property.sqft && (
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-ocean" />
              <span>{property.sqft} {t("rentals.sqft")}</span>
            </div>
          )}
        </div>

        {property.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.notes}</p>
        )}

        <button
          onClick={() => {
            const event = new CustomEvent("openChat", { detail: { property: property.address } });
            window.dispatchEvent(event);
          }}
          className="w-full py-2.5 bg-ocean/5 hover:bg-ocean text-ocean hover:text-white font-medium text-sm rounded-lg transition-all"
        >
          Schedule a Showing
        </button>
      </div>
    </div>
  );
}
