export interface Property {
  id: number;
  address: string;
  unit?: string;
  area: string;
  status: "listed" | "rented" | "sold" | "active" | "available";
  type?: "furnished" | "unfurnished";
  notes?: string;
  beds?: number;
  baths?: number;
  parking?: number;
  sqft?: number;
  price?: number;
  rentPrice?: number;
  listingType?: "rent" | "sale";
  imageUrl?: string;
  building?: string;
}

export interface Development {
  id: number;
  name: string;
  location: string;
  completion: string;
  description: string;
  imageUrl?: string;
  status: "upcoming" | "completed";
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  source: string;
  rating?: number;
}

export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl?: string;
}

export interface ResourceLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  external: boolean;
  icon?: string;
}

export interface Area {
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  count?: number;
}
