import { apiClient } from "../api-client";
import type { AvailabilityResponse } from "./models";

function checkNickname(nickname: string) {
  // 한글 닉네임이 URL 경로에 들어가므로 반드시 인코딩해요.
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export { checkNickname };
