/**
 * NextAuth.js v5 API Route Handler
 *
 * 모든 인증 관련 요청을 처리합니다:
 * - GET /api/auth/signin - 로그인 페이지
 * - POST /api/auth/signin - 로그인 처리
 * - GET /api/auth/signout - 로그아웃 페이지
 * - POST /api/auth/signout - 로그아웃 처리
 * - GET /api/auth/session - 세션 정보 조회
 * - GET /api/auth/csrf - CSRF 토큰
 * - GET /api/auth/providers - 제공자 목록
 */

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
