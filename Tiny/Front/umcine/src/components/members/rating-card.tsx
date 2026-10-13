import { Link } from "@tanstack/react-router";
import type { RatingResponse } from "../../api/members/models";

interface RatingCardProps {
  rating: RatingResponse;
  title: string | null; // TMDB에서 아직 못 불러왔으면 null
  posterUrl: string | null;
}

export default function RatingCard({
  rating,
  title,
  posterUrl,
}: RatingCardProps) {
  const movieTitle = title ?? `영화 #${rating.movieId}`;

  return (
    <article>
      <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }}>
        {posterUrl ? (
          <img
            className="aspect-2/3 w-full rounded-lg object-cover"
            src={posterUrl}
            alt={movieTitle}
          />
        ) : (
          <div className="flex aspect-2/3 w-full items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
            이미지 없음
          </div>
        )}
      </Link>
      <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }}>
        <h3 className="mt-2 text-sm font-semibold">{movieTitle}</h3>
      </Link>
      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
        <img src="/icons/star.svg" alt="" className="h-3.5 w-3.5" />
        <span className="font-semibold text-gray-700">{rating.score}.0</span>
        <span>· {rating.createdAt.slice(0, 10).replaceAll("-", ".")}</span>
      </p>
      {rating.comment && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
          {rating.comment}
        </p>
      )}
    </article>
  );
}
