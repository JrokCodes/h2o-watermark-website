export interface Property {
  id: number;
  address: string;
  unit?: string;
  area: string;
  status: "listed" | "rented" | "sold" | "active";
  type?: "furnished" | "unfurnished";
  notes?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  price?: number;
  rentPrice?: number;
  listingType?: "rent" | "sale";
  imageUrl?: string;
}

export interface Area {
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  count?: number;
}
