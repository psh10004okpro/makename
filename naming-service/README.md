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

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 DATABASE_URL 등을 설정하세요

# PostgreSQL 데이터베이스 준비 후 마이그레이션 실행
npm run prisma:migrate

# Prisma 클라이언트 생성
npm run prisma:generate

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

### 데이터베이스 설정

1. **PostgreSQL 설치 및 실행**
   ```bash
   # Docker를 사용하는 경우
   docker run --name naming-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

2. **데이터베이스 생성**
   ```bash
   # PostgreSQL에 접속하여 데이터베이스 생성
   createdb naming_service
   ```

3. **.env 파일 설정**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/naming_service?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ANTHROPIC_API_KEY="your-api-key-here"
   ```

4. **마이그레이션 실행**
   ```bash
   npm run prisma:migrate
   ```

### Prisma 명령어

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 생성 및 적용
npm run prisma:migrate

# Prisma Studio 실행 (데이터베이스 GUI)
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

### Phase 2: 데이터베이스 및 인증 구현 ✅
- [x] Prisma 스키마 완성 (User, NamingRequest, NamingResult 모델)
- [x] Enum 타입 정의 (NamingType, Gender, NamingMethod, RequestStatus)
- [x] NextAuth.js v5 설정 (Credentials Provider)
- [x] bcrypt로 비밀번호 해싱
- [x] 로그인/회원가입 페이지 구현
- [x] React Hook Form + Zod 폼 유효성 검증
- [x] 인증 미들웨어 설정 (보호된 라우트)
- [x] Server Actions 구현

### Phase 3: 사주팔자 로직
- [ ] 생년월일시 → 사주팔자 변환
- [ ] 오행 분석
- [ ] 용신 추출

### Phase 4: 한자 분석
- [ ] 한자 데이터베이스 구축
- [ ] 획수 계산
- [ ] 음양오행 분류
- [ ] 의미 분석

### Phase 5: LLM 통합
- [ ] Claude API 연동
- [ ] 이름 생성 프롬프트
- [ ] 결과 파싱 및 검증

### Phase 6: UI/UX
- [ ] 입력 폼 구현
- [ ] 결과 페이지 디자인
- [ ] 반응형 디자인
- [ ] 애니메이션

### Phase 7: 배포
- [ ] 결제 시스템
- [ ] 프로덕션 배포

## 인증 시스템

### 로그인/회원가입
- **로그인**: `/login` - 이메일/비밀번호 인증
- **회원가입**: `/signup` - 이메일, 이름, 비밀번호 (8자 이상, 대소문자+숫자 포함)

### 보호된 라우트
인증이 필요한 페이지:
- `/baby` - 신생아 작명 신청
- `/rename` - 개명 신청
- `/company` - 회사명 작명 신청
- `/result/*` - 작명 결과 조회

인증되지 않은 사용자가 접근 시 자동으로 `/login`으로 리다이렉트됩니다.

### 인증 기술 스택
- **NextAuth.js v5**: 인증 프레임워크
- **bcryptjs**: 비밀번호 해싱 (salt rounds: 10)
- **JWT**: 세션 관리
- **Zod**: 입력 유효성 검증
- **React Hook Form**: 폼 관리

## 프로젝트 구조 상세

```
naming-service/
├── app/
│   ├── (auth)/              # 인증 라우트 그룹 (별도 레이아웃)
│   │   ├── login/           # 로그인 페이지
│   │   │   └── page.tsx
│   │   └── signup/          # 회원가입 페이지
│   │       └── page.tsx
│   ├── (main)/              # 메인 서비스 라우트 (보호됨)
│   │   ├── baby/            # 신생아 작명
│   │   ├── rename/          # 개명
│   │   ├── company/         # 회사명
│   │   └── result/[id]/     # 결과 페이지
│   ├── actions/             # Server Actions
│   │   └── auth.ts          # 인증 액션 (회원가입, 로그인)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts # NextAuth API 핸들러
│   └── page.tsx             # 메인 랜딩 페이지
├── components/
│   └── ui/                  # 재사용 가능한 UI 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── form.tsx         # react-hook-form 통합
├── lib/
│   ├── auth.ts              # NextAuth 설정
│   ├── db.ts                # Prisma 클라이언트 싱글톤
│   └── utils.ts             # 유틸리티 함수 (cn 등)
├── prisma/
│   └── schema.prisma        # 데이터베이스 스키마
└── middleware.ts            # 인증 미들웨어
```

## 라이센스

MIT
