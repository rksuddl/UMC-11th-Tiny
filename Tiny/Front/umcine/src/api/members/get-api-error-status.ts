import { HTTPError } from "ky";

// 서버가 응답한 HTTP 상태 코드를 꺼내요. 서버에 닿지 못했으면(CORS, 서버 꺼짐) null이에요.
export function getApiErrorStatus(error: unknown) {
  return error instanceof HTTPError ? error.response.status : null;
}
