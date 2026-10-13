import { apiClient } from "../api-client";
import type { RatingPageResponse } from "./models";

interface GetMemberRatingsParams {
  memberId: number;
  page: number; // 0부터 시작
  size: number;
}

function getMemberRatings({ memberId, page, size }: GetMemberRatingsParams) {
  return apiClient
    .get(`members/${memberId}/ratings`, {
      searchParams: { page, size },
    })
    .json<RatingPageResponse>();
}

export { getMemberRatings };
