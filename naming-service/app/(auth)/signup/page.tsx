"use client"

/**
 * 회원가입 페이지
 *
 * 새로운 사용자 등록 기능을 제공합니다.
 * - React Hook Form으로 폼 관리
 * - Zod로 유효성 검증
 * - Server Action으로 회원가입 처리
 * - 비밀번호 강도 검증
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signUpAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 회원가입 폼 스키마
const signUpSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다."
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  })

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form 초기화
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  // 회원가입 폼 제출 핸들러
  async function onSubmit(data: SignUpFormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("name", data.name)
      formData.append("password", data.password)

      // Server Action 호출
      const result = await signUpAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.message || "회원가입이 완료되었습니다.")
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.")
      console.error("회원가입 에러:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            회원가입
          </CardTitle>
          <CardDescription className="text-center">
            계정을 만들고 작명 서비스를 이용해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 에러 메시지 */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* 성공 메시지 */}
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  {success}
                </div>
              )}

              {/* 이름 필드 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="홍길동"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 이메일 필드 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 필드 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      8자 이상, 대문자, 소문자, 숫자 포함
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 확인 필드 */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 회원가입 버튼 */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-slate-600 dark:text-slate-400">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-medium text-slate-900 dark:text-slate-100 hover:underline"
            >
              로그인
            </Link>
          </div>
          <div className="text-xs text-center text-slate-500">
            <Link href="/" className="hover:underline">
              메인 페이지로 돌아가기
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
