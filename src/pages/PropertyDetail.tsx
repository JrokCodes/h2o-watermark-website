import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bed, Bath, Maximize, Car, Calendar, Eye, Phone, MapPin } from "lucide-react";
import { fallbackProperties } from "../data/fallback-properties";
import { salesListings } from "../data/sales-listings";
import { getPropertyDetail } from "../data/property-details";
import PropertyGallery from "../components/property/PropertyGallery";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = Number(id);

  const property =
    fallbackProperties.find((p) => p.id === propertyId) ||
    salesListings.find((p) => p.id === propertyId);

  const detail = getPropertyDetail(propertyId);

  if (!property) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="font-playfair text-3xl mb-4">Property Not Found</h1>
        <Link to="/" className="text-ocean hover:underline">Return Home</Link>
      </div>
    );
  }

  const isRental = property.listingType === "rent";
  const backHref = isRental ? "/rentals" : "/sales";
  const backLabel = isRental ? "Back to Rentals" : "Back to Sales";
  const fullAddress = property.address + (property.unit ? " " + property.unit : "");
  const areaDisplay = property.area
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const price = property.rentPrice
    ? `$${property.rentPrice.toLocaleString()}/mo`
    : property.price
    ? `$${property.price.toLocaleString()}`
    : "Contact for price";

  const photos = detail?.photos || [];

  const openChat = () => {
    const event = new CustomEvent("openChat", { detail: { property: fullAddress } });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container-custom py-8">
        <button
          onClick={() => navigate(backHref)}
          className="inline-flex items-center gap-2 text-ocean hover:text-sunset font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>

        {/* Gallery */}
        <PropertyGallery photos={photos} alt={fullAddress} />

        {/* Header */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {property.building && (
              <p className="text-sunset text-sm uppercase tracking-[0.2em] font-medium mb-2">
                {property.building}
              </p>
            )}
            <h1 className="font-playfair text-4xl sm:text-5xl font-semibold text-foreground mb-3">
              {property.address}
              {property.unit && <span className="text-ocean ml-3 text-3xl">{property.unit}</span>}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>{areaDisplay}, Honolulu, HI</span>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-border">
              {property.beds !== undefined && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-ocean" />
                  <span className="font-medium">{property.beds} {property.beds === 1 ? "Bed" : "Beds"}</span>
                </div>
              )}
              {property.baths !== undefined && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-ocean" />
                  <span className="font-medium">{property.baths} {property.baths === 1 ? "Bath" : "Baths"}</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-ocean" />
                  <span className="font-medium">{property.sqft.toLocaleString()} sqft</span>
                </div>
              )}
              {property.parking !== undefined && (
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-ocean" />
                  <span className="font-medium">{property.parking} Parking</span>
                </div>
              )}
              {detail?.yearBuilt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-ocean" />
                  <span className="font-medium">Built {detail.yearBuilt}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {detail?.description && (
              <section className="mt-8">
                <h2 className="font-playfair text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {detail.description}
                </p>
              </section>
            )}

            {/* View */}
            {detail?.view && detail.view.length > 0 && (
              <section className="mt-8">
                <h2 className="font-playfair text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-ocean" />
                  Views
                </h2>
                <div className="flex flex-wrap gap-2">
                  {detail.view.map((v) => (
                    <span key={v} className="px-4 py-1.5 bg-ocean/10 text-ocean rounded-full text-sm font-medium">
                      {v}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Amenities */}
            {detail?.amenities && detail.amenities.length > 0 && (
              <section className="mt-8">
                <h2 className="font-playfair text-2xl font-semibold mb-4">Building Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {detail.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-sunset" />
                      {a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions */}
            {detail?.inclusions && detail.inclusions.length > 0 && (
              <section className="mt-8">
                <h2 className="font-playfair text-2xl font-semibold mb-4">What's Included</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {detail.inclusions.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-ocean" />
                      {a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Schools */}
            {detail?.schools && (detail.schools.elementary || detail.schools.middle || detail.schools.high) && (
              <section className="mt-8">
                <h2 className="font-playfair text-2xl font-semibold mb-4">Schools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {detail.schools.elementary && (
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Elementary</p>
                      <p className="font-medium text-foreground">{detail.schools.elementary}</p>
                    </div>
                  )}
                  {detail.schools.middle && (
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Middle</p>
                      <p className="font-medium text-foreground">{detail.schools.middle}</p>
                    </div>
                  )}
                  {detail.schools.high && (
                    <div className="p-4 bg-cream rounded-lg">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">High</p>
                      <p className="font-medium text-foreground">{detail.schools.high}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-card p-6 border border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {isRental ? "Monthly Rent" : "Listed Price"}
              </p>
              <div className="font-playfair text-4xl font-semibold text-ocean mb-6">{price}</div>

              <button
                onClick={openChat}
                className="w-full py-3.5 bg-sunset hover:bg-sunset-dark text-white font-semibold rounded-lg transition-all mb-3"
              >
                Schedule a Showing
              </button>

              <a
                href="tel:+18084273301"
                className="w-full py-3.5 bg-ocean/5 hover:bg-ocean text-ocean hover:text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                (808) 427-3301
              </a>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Amy answers 24/7 — English, Korean, Japanese
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
