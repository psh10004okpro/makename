"use server"

/**
 * 인증 관련 Server Actions
 *
 * 회원가입, 로그인, 로그아웃 등의 인증 관련 서버 액션을 제공합니다.
 */

import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"
import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"
import { z } from "zod"

// 회원가입 스키마
const signUpSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다."
    ),
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
})

// 로그인 스키마
const signInSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
})

/**
 * 회원가입 Server Action
 *
 * @param formData - 회원가입 폼 데이터
 * @returns 성공 또는 에러 메시지
 */
export async function signUpAction(formData: FormData) {
  try {
    // 폼 데이터 추출
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    }

    // 유효성 검증
    const validatedData = signUpSchema.parse(rawData)

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return {
        error: "이미 사용 중인 이메일입니다.",
      }
    }

    // 비밀번호 해싱 (bcrypt, salt rounds: 10)
    const hashedPassword = await hash(validatedData.password, 10)

    // 사용자 생성
    await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      },
    })

    return {
      success: true,
      message: "회원가입이 완료되었습니다. 로그인해주세요.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message,
      }
    }

    console.error("회원가입 에러:", error)
    return {
      error: "회원가입 중 오류가 발생했습니다.",
    }
  }
}

/**
 * 로그인 Server Action
 *
 * @param formData - 로그인 폼 데이터
 * @returns 성공 또는 에러 메시지
 */
export async function signInAction(formData: FormData) {
  try {
    // 폼 데이터 추출
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    // 유효성 검증
    const validatedData = signInSchema.parse(rawData)

    // NextAuth signIn 호출
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return {
      success: true,
      message: "로그인 성공",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message,
      }
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "이메일 또는 비밀번호가 올바르지 않습니다.",
          }
        default:
          return {
            error: "로그인 중 오류가 발생했습니다.",
          }
      }
    }

    console.error("로그인 에러:", error)
    return {
      error: "로그인 중 오류가 발생했습니다.",
    }
  }
}

/**
 * 로그아웃 Server Action
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}
