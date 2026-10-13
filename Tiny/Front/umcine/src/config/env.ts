const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

// 우리 백엔드(Spring) 주소. .env에 없으면 로컬 기본값을 사용해요.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
