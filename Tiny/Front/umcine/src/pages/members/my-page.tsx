import { useEffect, useState } from "react";
import { getApiErrorStatus } from "../../api/members/get-api-error-status";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { RatingPageResponse } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { ErrorState } from "../../components/common/error-state";
import RatingCard from "../../components/members/rating-card";
import Pagination from "../../components/movies/pagination";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// 로그인은 7주차에 구현해요. 그전까지는 시드 데이터의 1번 회원으로 조회해요.
const TEMP_MEMBER_ID = 1;
const PAGE_SIZE = 10;

export function MyPage() {
  const [page, setPage] = useState(0); // 백엔드 기준 0부터 시작
  const [ratingPage, setRatingPage] = useState<RatingPageResponse | null>(null);
  const [movies, setMovies] = useState<Record<number, TmdbMovieDetail>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // 1) 우리 백엔드에서 평점 목록을 페이지 단위로 가져와요.
  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setErrorMessage(null);

    getMemberRatings({ memberId: TEMP_MEMBER_ID, page, size: PAGE_SIZE })
      .then((response) => {
        if (!ignore) setRatingPage(response);
      })
      .catch((error) => {
        if (ignore) return;
        const status = getApiErrorStatus(error);
        setErrorMessage(
          status === 404
            ? "존재하지 않는 회원이에요."
            : status
              ? `평점을 불러오지 못했어요. (${status})`
              : "서버에 연결하지 못했어요. 백엔드 서버와 CORS 설정을 확인해 주세요.",
        );
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, retryCount]);

  // 2) 평점에는 movieId만 있으므로, 제목·포스터는 TMDB에서 채워요.
  useEffect(() => {
    if (!ratingPage) return;
    let ignore = false;

    const movieIds = ratingPage.content.map((rating) => rating.movieId);

    Promise.allSettled(movieIds.map((id) => getMovieDetail(id))).then(
      (results) => {
        if (ignore) return;
        const loaded: Record<number, TmdbMovieDetail> = {};
        results.forEach((result) => {
          if (result.status === "fulfilled")
            loaded[result.value.id] = result.value;
        });
        setMovies((prev) => ({ ...prev, ...loaded }));
      },
    );

    return () => {
      ignore = true;
    };
  }, [ratingPage]);

  function renderRatings() {
    if (isLoading) {
      return (
        <p className="py-20 text-center text-gray-500">
          평점을 불러오는 중이에요.
        </p>
      );
    }
    if (errorMessage) {
      return (
        <ErrorState
          message={errorMessage}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      );
    }
    if (!ratingPage || ratingPage.content.length === 0) {
      return (
        <p className="py-20 text-center text-gray-500">
          아직 남긴 평점이 없어요.
        </p>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {ratingPage.content.map((rating) => {
            const movie = movies[rating.movieId];
            return (
              <RatingCard
                key={rating.ratingId}
                rating={rating}
                title={movie?.title ?? null}
                posterUrl={getTmdbPosterUrl(movie?.poster_path ?? null)}
              />
            );
          })}
        </div>
        {/* Pagination 컴포넌트는 1부터 세기 때문에 +1 / -1로 변환해요 */}
        <Pagination
          currentPage={ratingPage.page + 1}
          totalPages={ratingPage.totalPages}
          onPageChange={(nextPage) => setPage(nextPage - 1)}
        />
      </>
    );
  }

  return (
    <main className="px-4 py-8 sm:px-10">
      <h1 className="border-b border-gray-200 pb-6 text-3xl font-bold">
        내 정보
      </h1>

      <section className="pt-6">
        <h2 className="mb-4 flex items-baseline gap-2 text-sm font-bold">
          내 평점
          {ratingPage && !errorMessage && (
            <span className="text-xs font-normal text-gray-400">
              {ratingPage.totalElements}개 · 최신순
            </span>
          )}
        </h2>
        {renderRatings()}
      </section>
    </main>
  );
}
