interface AvailabilityResponse {
  available: boolean;
}

interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RatingPageResponse {
  content: RatingResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type { AvailabilityResponse, RatingPageResponse, RatingResponse };
