"use client"

/**
 * 로그인 페이지
 *
 * 이메일과 비밀번호를 사용한 로그인 기능을 제공합니다.
 * - React Hook Form으로 폼 관리
 * - Zod로 유효성 검증
 * - Server Action으로 인증 처리
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signInAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 로그인 폼 스키마
const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form 초기화
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 로그인 폼 제출 핸들러
  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    setError(null)

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)

      // Server Action 호출
      const result = await signInAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // 로그인 성공 - 메인 페이지로 리다이렉트
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.")
      console.error("로그인 에러:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            로그인
          </CardTitle>
          <CardDescription className="text-center">
            한국 전통 작명소에 오신 것을 환영합니다
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-slate-600 dark:text-slate-400">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="font-medium text-slate-900 dark:text-slate-100 hover:underline"
            >
              회원가입
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
