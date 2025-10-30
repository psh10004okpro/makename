# 한국 전통 작명소 (Korean Traditional Naming Service)

전통 사주팔자와 AI를 결합한 작명 서비스

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma + PostgreSQL
- **State Management**: Zustand
- **Form Management**: React Hook Form + Zod
- **Authentication**: NextAuth.js v5
- **AI**: Anthropic Claude API
- **Icons**: Lucide React
- **Font**: Pretendard (Korean)

## 프로젝트 구조

```
naming-service/
├── app/
│   ├── (auth)/               # 인증 관련 페이지
│   │   ├── login/           # 로그인
│   │   └── signup/          # 회원가입
│   ├── (main)/              # 메인 서비스 페이지
│   │   ├── baby/            # 신생아 작명
│   │   ├── rename/          # 개명
│   │   ├── company/         # 회사명·상호
│   │   ├── result/[id]/     # 결과 페이지
│   │   └── page.tsx         # 메인 랜딩 페이지
│   ├── api/                 # API Routes
│   │   └── auth/            # NextAuth 설정
│   ├── actions/             # Server Actions
│   ├── globals.css          # 전역 스타일
│   └── layout.tsx           # 루트 레이아웃
├── components/
│   ├── ui/                  # 재사용 가능한 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── forms/               # 폼 컴포넌트
│   ├── naming/              # 작명 관련 컴포넌트
│   └── layout/              # 레이아웃 컴포넌트
├── lib/
│   ├── saju/                # 사주팔자 계산 로직
│   ├── hanja/               # 한자 분석 로직
│   ├── llm/                 # LLM 통합 (Claude API)
│   ├── db.ts                # Prisma 클라이언트
│   ├── auth.ts              # NextAuth 설정
│   └── utils.ts             # 유틸리티 함수
├── prisma/
│   └── schema.prisma        # 데이터베이스 스키마
├── types/                   # TypeScript 타입 정의
└── public/                  # 정적 파일

```

## 데이터베이스 스키마

### User
사용자 정보
- id, email, name, password
- 작명 요청 기록

### NamingRequest
작명 요청 정보
- id, userId, type (baby/rename/company)
- input (JSON: 생년월일, 성씨 등)
- status (pending/processing/completed/failed)

### NamingResult
작명 결과
- id, requestId
- suggestions (JSON: 추천 이름 목록)
- analysis (JSON: 사주팔자 분석)

## 시작하기

### 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/naming_service?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Anthropic API
ANTHROPIC_API_KEY="your-api-key-here"
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run prisma:generate

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

### Prisma 명령어

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# Prisma Studio 실행
npm run prisma:studio
```

## 주요 기능

### 1. 신생아 작명
- 생년월일시 입력
- 성씨 선택
- 사주팔자 분석
- AI 기반 이름 추천

### 2. 개명
- 현재 이름 및 사주 정보 입력
- 개명 사유 분석
- 새로운 이름 제안

### 3. 회사명·상호 작명
- 사업 분야 입력
- 대표자 사주 정보
- 브랜드 컨셉 반영
- 상호명 추천

## 개발 로드맵

### Phase 1: 초기 설정 ✅
- [x] Next.js 프로젝트 생성
- [x] 필수 패키지 설치
- [x] 프로젝트 구조 구성
- [x] Prisma 스키마 작성
- [x] 기본 UI 컴포넌트

### Phase 2: 사주팔자 로직
- [ ] 생년월일시 → 사주팔자 변환
- [ ] 오행 분석
- [ ] 용신 추출

### Phase 3: 한자 분석
- [ ] 한자 데이터베이스 구축
- [ ] 획수 계산
- [ ] 음양오행 분류
- [ ] 의미 분석

### Phase 4: LLM 통합
- [ ] Claude API 연동
- [ ] 이름 생성 프롬프트
- [ ] 결과 파싱 및 검증

### Phase 5: UI/UX
- [ ] 입력 폼 구현
- [ ] 결과 페이지 디자인
- [ ] 반응형 디자인
- [ ] 애니메이션

### Phase 6: 인증 및 배포
- [ ] NextAuth 설정
- [ ] 사용자 관리
- [ ] 결제 시스템
- [ ] 프로덕션 배포

## 라이센스

MIT
