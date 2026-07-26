export type ListingStatus = "active" | "draft" | "sold";

export interface SellerListing {
  _id: string;
  title: string; // e.g. "2023 Porsche 911 GT3"
  vin: string;
  image?: string;
  status: ListingStatus;
  price: number;
  marketAvg?: number; // for active/draft
  finalSale?: number; // for sold
  views?: number;
  saves?: number;
  photosPublished: boolean;
  soldOn?: string; // ISO date
  marketTimeDays?: number; // days it took to sell
  createdAt: string;
}

export interface SellerStats {
  totalViews: number;
  totalViewsChangePct: number; // e.g. 14 means +14%
  pendingOffers: number;
  pendingOffersNeedingReview: number;
  activeListings: number;
  inventoryHealth: "Optimal" | "Needs attention" | "Low";
  avgDaysToSell: number;
  avgDaysToSellPercentile: number; // e.g. 5 means "top 5% in region"
}

export interface SellerListingsResponse {
  listings: SellerListing[];
  total: number;
}