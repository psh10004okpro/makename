import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

// NextAuth 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string | null
  }
}

/**
 * NextAuth.js v5 설정
 * - Credentials 제공자를 사용한 이메일/비밀번호 인증
 * - JWT 전략 사용
 * - bcrypt로 비밀번호 해싱/검증
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.")
        }

        // 이메일로 사용자 조회
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
        }

        // 비밀번호 검증
        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
        }

        // 인증 성공 - 사용자 정보 반환
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT 전략 사용
  },
  pages: {
    signIn: "/login", // 커스텀 로그인 페이지
  },
  callbacks: {
    async jwt({ token, user }) {
      // JWT 토큰에 사용자 ID 추가
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // 세션에 사용자 ID 추가
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
