export type Venue = {
  venue_id: string;
  canonical_name: string;
  district: string;
  road_address: string;
  kakao_url: string | null;
  sources: string[];
  hall_count: number;
  brightness_values: Array<"bright" | "dark">;
  recommendation_ready: boolean;
  source_count: number;
};

export type Hall = {
  hall_id: string;
  venue_id: string;
  hall_name: string | null;
  atmosphere: "bright" | "dark" | null;
  meal_won: number | null;
  seated_capacity: number | null;
  minimum_guarantee: number | null;
  rental_won: number | null;
  source: string;
  source_url: string;
};

export type UserConditions = {
  districts: string[];
  guestCount: number | null;
};
