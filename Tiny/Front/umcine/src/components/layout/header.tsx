import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const location = useLocation();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-10 py-4">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <img src="/icons/movie.svg" alt="" className="h-6 w-6" />
          UMCine
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={cn(
              "text-gray-700",
              location.pathname === "/" &&
                "font-semibold text-black underline underline-offset-4",
            )}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={cn(
              "text-gray-700",
              location.pathname === "/search" &&
                "font-semibold text-black underline underline-offset-4",
            )}
          >
            검색
          </Link>
          <Link
            to="/me"
            className={cn(
              "text-gray-700",
              location.pathname === "/me" &&
                "font-semibold text-black underline underline-offset-4",
            )}
          >
            내 정보
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/search"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300"
        >
          <img src="/icons/search.svg" alt="검색" className="h-4 w-4" />
        </Link>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          로그인
        </button>
      </div>
    </header>
  );
}
