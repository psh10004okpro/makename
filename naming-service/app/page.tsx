import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">
            한국 전통 작명소
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            전통 사주팔자와 AI를 결합한 작명 서비스
          </p>
        </div>

        {/* Services Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">신생아 작명</CardTitle>
              <CardDescription>
                아기의 사주팔자를 분석하여 최적의 이름을 찾아드립니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/baby">
                <Button className="w-full">작명 신청</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">개명</CardTitle>
              <CardDescription>
                새로운 인생을 위한 개명 서비스를 제공합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/rename">
                <Button className="w-full">개명 신청</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">회사명·상호</CardTitle>
              <CardDescription>
                번창하는 사업을 위한 상호명을 제안합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/company">
                <Button className="w-full">작명 신청</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-12 text-slate-900 dark:text-slate-50">
            서비스 특징
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">전통 사주팔자</h3>
              <p className="text-slate-600 dark:text-slate-400">
                생년월일시를 기반으로 정확한 사주팔자 분석
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI 기반 분석</h3>
              <p className="text-slate-600 dark:text-slate-400">
                최신 AI 기술로 한자의 의미와 조합 분석
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">맞춤형 추천</h3>
              <p className="text-slate-600 dark:text-slate-400">
                개인별 특성에 맞는 최적의 이름 제안
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
