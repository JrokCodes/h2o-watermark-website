import type { NewsArticle } from "../lib/types";

// News headlines from h2owatermark.com/news_2023.php
// (the source page has no article photos, so we map each item to the most relevant
// development photo from h2owatermark.com/new_dev/)
export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "$27.5M Park Lane Ala Moana Penthouse Sold",
    excerpt: "One of Honolulu's most luxurious penthouses has changed hands, marking another major luxury transaction in the Ala Moana corridor.",
    category: "Transactions",
    date: "October 2023",
    imageUrl: "/images/developments/park-lane-ala-moana.jpg",
  },
  {
    id: 2,
    title: "Wailuku Estate Sold for $11M on Maui",
    excerpt: "A historic Wailuku estate has been sold for $11 million, signaling continued strong demand for high-end Maui real estate.",
    category: "Transactions",
    date: "September 2023",
    imageUrl: "/images/developments/waiea.jpg",
  },
  {
    id: 3,
    title: "Ward Village Announces 12th Residential Project",
    excerpt: "The Howard Hughes Corporation has announced its 12th residential tower in Ward Village, expanding the master-planned community.",
    category: "Development",
    date: "August 2023",
    imageUrl: "/images/developments/launiu-ward-village.jpg",
  },
  {
    id: 4,
    title: "Hawaii Vacation & Second-Home Markets See Gains",
    excerpt: "Hawaii's vacation home market continues to show strength, with mainland buyers driving significant activity.",
    category: "Market Updates",
    date: "July 2023",
    imageUrl: "/images/developments/victoria-place.jpg",
  },
  {
    id: 5,
    title: "Suburbs Setting the Pace for Migration Patterns",
    excerpt: "New data shows the suburbs continue to attract migrants, with shifting patterns reshaping the housing landscape.",
    category: "Market Updates",
    date: "June 2023",
    imageUrl: "/images/developments/park-on-keeaumoku.jpg",
  },
  {
    id: 6,
    title: "Hawaii Realtors Conference 2023",
    excerpt: "Annual Hawaii Realtors Conference brings together industry leaders to discuss market trends and best practices.",
    category: "Events",
    date: "May 2023",
    imageUrl: "/images/developments/symphony-honolulu.jpg",
  },
];
