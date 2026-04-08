import type { Property } from "../../lib/types";
import { useLanguage } from "../../contexts/LanguageContext";
import { Bed, Bath, Maximize, MapPin, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { getPropertyDetail } from "../../data/property-details";

export default function PropertyCard({ property }: { property: Property }) {
  const { t } = useLanguage();
  const isRental = property.listingType === "rent";
  const isAvailable = property.status === "listed";
  const isRented = property.status === "rented";
  const isSold = property.status === "sold";

  const price = property.rentPrice
    ? `$${property.rentPrice.toLocaleString()}${t("rentals.perMonth")}`
    : property.price
    ? `$${property.price.toLocaleString()}`
    : "Contact for price";

  const areaDisplay = property.area
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const cardOpacity = isAvailable ? "" : "opacity-95";

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${cardOpacity}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={
            property.imageUrl ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
          }
          alt={property.address}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            !isAvailable ? "grayscale-[20%]" : ""
          }`}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";
          }}
        />

        {/* Diagonal SOLD / RENTED red ribbon — top left */}
        {(isSold || isRented) && (
          <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none">
            <div className="absolute top-[28px] -left-[36px] w-[160px] bg-red-600 text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg transform -rotate-45 origin-center">
              {isSold ? "Sold" : "Rented"}
            </div>
          </div>
        )}

        {/* FOR SALE / FOR RENT badge — top right */}
        {isAvailable && (
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            <span className="px-3 py-1.5 bg-ocean text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg">
              For {isRental ? "Rent" : "Sale"}
            </span>
            <span className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-lg">
              Available Now
            </span>
          </div>
        )}

        {/* Furnished badge */}
        {property.type === "furnished" && (
          <span className="absolute bottom-16 right-4 px-2.5 py-1 bg-white/95 text-ocean-dark text-[10px] font-semibold rounded-full uppercase tracking-wider">
            Furnished
          </span>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="text-white text-2xl font-playfair font-semibold drop-shadow-md">
            {price}
          </div>
        </div>
      </div>

      <div className="p-6">
        {property.building && (
          <p className="text-xs uppercase tracking-[0.15em] text-sunset font-semibold mb-1">
            {property.building}
          </p>
        )}
        <h3 className="font-playfair text-lg font-semibold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
          {property.address}
          {property.unit && <span className="text-ocean ml-2 text-base">{property.unit}</span>}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5" />
          <span>{areaDisplay}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-foreground/70 mb-4 flex-wrap">
          {property.beds !== undefined && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-ocean" />
              <span>{property.beds} bd</span>
            </div>
          )}
          {property.baths !== undefined && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-ocean" />
              <span>{property.baths} ba</span>
            </div>
          )}
          {property.parking !== undefined && (
            <div className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5 text-ocean" />
              <span>{property.parking} pk</span>
            </div>
          )}
          {property.sqft && (
            <div className="flex items-center gap-1">
              <Maximize className="h-3.5 w-3.5 text-ocean" />
              <span>{property.sqft} sqft</span>
            </div>
          )}
        </div>

        {property.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.notes}</p>
        )}

        {isAvailable ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                const event = new CustomEvent("openChat", {
                  detail: { property: property.address + (property.unit ? " " + property.unit : "") },
                });
                window.dispatchEvent(event);
              }}
              className="flex-1 py-2.5 bg-sunset hover:bg-sunset-dark text-white font-medium text-sm rounded-lg transition-all"
            >
              Schedule a Showing
            </button>
            {getPropertyDetail(property.id) && (
              <Link
                to={`/property/${property.id}`}
                className="flex-1 flex items-center justify-center text-center px-2 py-2.5 bg-ocean/5 hover:bg-ocean text-ocean hover:text-white font-medium text-sm rounded-lg transition-all"
              >
                View Details
              </Link>
            )}
          </div>
        ) : (
          <div className="w-full py-2.5 text-center text-xs text-muted-foreground italic">
            {isRented
              ? "Previously managed by H2O Watermark"
              : "Successfully sold by H2O Watermark"}
          </div>
        )}
      </div>
    </div>
  );
}
