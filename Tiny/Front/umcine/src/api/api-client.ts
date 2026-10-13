import ky from "ky";
import { env } from "../config/env";

// TMDB가 아닌 우리 백엔드 전용 클라이언트예요. (API 키를 붙이지 않아요)
export const apiClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
});
