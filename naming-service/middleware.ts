/**
 * NextAuth.js 인증 미들웨어
 *
 * 보호된 라우트에 대한 접근 제어를 수행합니다.
 * - 보호된 라우트: /baby, /rename, /company, /result
 * - 비보호 라우트: /, /login, /signup
 * - 인증되지 않은 사용자는 /login으로 리다이렉트
 */

import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // 보호된 라우트 정의
  const protectedRoutes = ["/baby", "/rename", "/company", "/result"]

  // 현재 경로가 보호된 라우트인지 확인
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  )

  // 보호된 라우트에 인증되지 않은 사용자가 접근하려고 하면 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin)
    // 로그인 후 원래 페이지로 돌아가기 위해 callbackUrl 설정
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하면 메인 페이지로 리다이렉트
  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", nextUrl.origin))
  }

  return NextResponse.next()
})

// 미들웨어 적용 경로 설정
// API 라우트, static 파일, favicon 등은 제외
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 경로에 미들웨어 적용:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 폴더의 파일들 (*.svg, *.png 등)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
}
