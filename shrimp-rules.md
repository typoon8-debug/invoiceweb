# Development Guidelines — invoice-web

> **AI Agent 전용 문서**: 코딩 에이전트가 작업 시 반드시 참조해야 하는 프로젝트 규칙입니다.

---

## 1. Project Overview

- **앱 이름**: invoice-web (패키지명: `claude-nextjs-starters`)
- **목적**: 노션에서 작성한 견적서를 클라이언트가 토큰 URL로 접근해 웹에서 확인하고 PDF 다운로드하는 MVP 서비스
- **주요 사용자**: 프리랜서·소규모 사업자(작성자), 견적서 수신 클라이언트

### 기술 스택

| 분류         | 기술                                        |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 15.5.3 (App Router + Turbopack)     |
| Runtime      | React 19.1.0 + TypeScript 5                 |
| Styling      | TailwindCSS v4 + shadcn/ui (new-york style) |
| Forms        | React Hook Form + Zod                       |
| Icons        | Lucide React                                |
| Notification | Sonner (toast)                              |
| DevTools     | ESLint + Prettier + Husky + lint-staged     |

### 현재 구현 상태 (2026-04-07 기준)

- **구현 완료**: 홈(`/`), 로그인(`/login`), 회원가입(`/signup`), 레이아웃/네비게이션/섹션 컴포넌트
- **미구현**: 대시보드, 견적서 생성/미리보기/뷰어, Notion API 연동, Zustand 상태관리, 인증 미들웨어, API Routes

---

## 2. Directory Structure & File Placement

```
src/
├── app/                        # Next.js App Router 페이지
│   ├── layout.tsx              # 루트 레이아웃 (전역 Provider, Font, Toaster)
│   ├── page.tsx                # 홈페이지 (/)
│   ├── globals.css             # 전역 CSS (TailwindCSS v4 @import)
│   ├── (auth)/                 # 인증 그룹 라우트
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/            # 작성자 전용 보호 라우트
│   │   ├── dashboard/page.tsx
│   │   ├── invoices/
│   │   │   ├── new/page.tsx    # 견적서 생성
│   │   │   └── [id]/preview/page.tsx
│   │   └── layout.tsx          # 인증 체크 레이아웃
│   ├── view/[token]/page.tsx   # 클라이언트 뷰어 (토큰 URL, 비로그인 접근)
│   └── api/                    # API Routes (Server-side)
│       ├── auth/
│       ├── invoices/
│       └── notion/
├── components/
│   ├── ui/                     # shadcn/ui 기본 컴포넌트만 (비즈니스 로직 금지)
│   ├── layout/                 # header.tsx, footer.tsx, container.tsx
│   ├── navigation/             # main-nav.tsx, mobile-nav.tsx
│   ├── sections/               # 홈페이지 섹션 (hero, features, cta)
│   ├── providers/              # React Context Provider (theme-provider.tsx)
│   └── [feature-name]-form.tsx # 최상위: 단일 페이지에 쓰는 폼 컴포넌트
├── lib/
│   ├── utils.ts                # cn() 등 공통 유틸리티
│   ├── env.ts                  # Zod 환경변수 검증 (★ 환경변수 추가 시 반드시 수정)
│   ├── schemas/                # Zod 스키마 (auth.ts, invoice.ts 등)
│   ├── hooks/                  # 커스텀 훅 (use-*.ts)
│   ├── stores/                 # Zustand 스토어 (use-*-store.ts)
│   ├── notion.ts               # Notion API 클라이언트
│   └── types/                  # TypeScript 타입 정의
└── middleware.ts               # 인증 보호 라우트 처리 (루트 레벨)
```

### 파일 배치 결정 기준

- **한 페이지에서만 사용** → 해당 페이지 폴더 내 `_components/` 또는 컴포넌트 루트에 배치
- **여러 페이지에서 재사용** → `src/components/` 적절한 카테고리에 배치
- **shadcn/ui 기본 컴포넌트** → `src/components/ui/` (직접 수정 최소화)
- **API 통신 로직** → `src/app/api/` (Route Handler) 또는 Server Action
- **Zod 스키마** → `src/lib/schemas/` (폼과 API 모두에서 재사용)

---

## 3. Code Style Rules

### 포매팅

- 들여쓰기: **스페이스 2칸**
- 세미콜론: **사용 안 함**
- 따옴표: **작은따옴표(`''`)**
- 줄 최대 길이: Prettier 기본값 준수
- 파일 크기: **300줄 이하** 유지

### 네이밍 컨벤션

```typescript
// 파일명: kebab-case
invoice - card.tsx
use - invoice - store.ts

// 컴포넌트: PascalCase
export function InvoiceCard() {}

// 변수/함수: camelCase
const invoiceData = {}
function fetchInvoice() {}

// 타입/인터페이스: PascalCase
interface InvoiceItem {}
type InvoiceStatus = 'draft' | 'sent' | 'expired'

// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
```

### Import 순서

```typescript
// 1. 외부 라이브러리
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// 2. 내부 모듈 (@/ 경로)
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 3. 상대 경로 (동일 폴더 내 파일만 허용)
import './component.css'
```

---

## 4. Component Rules

### shadcn/ui 컴포넌트 추가

```bash
# 새 shadcn 컴포넌트 추가 시 반드시 이 명령어 사용
npx shadcn@latest add [component-name]

# 예시
npx shadcn@latest add table
npx shadcn@latest add date-picker
```

- `components.json`에 `style: "new-york"`, `baseColor: "zinc"` 설정 유지
- `src/components/ui/` 파일은 직접 수정하지 않고 **wrapper 컴포넌트** 생성

### 컴포넌트 작성 패턴

```tsx
// ✅ 올바른 패턴 — JSDoc 주석, named export, cn() 사용
/**
 * 견적서 카드 컴포넌트
 */
export function InvoiceCard({
  invoice,
  className,
}: {
  invoice: Invoice
  className?: string
}) {
  return (
    <div className={cn('bg-card rounded-lg border p-6', className)}>
      {/* 내용 */}
    </div>
  )
}

// ❌ 금지 — default export (페이지 파일 제외), any 타입, 인라인 스타일
export default function InvoiceCard({ data }: { data: any }) {
  return <div style={{ padding: '24px' }}>{data}</div>
}
```

### 컴포넌트 분류 규칙

| 위치          | 포함할 것                     | 포함 금지                |
| ------------- | ----------------------------- | ------------------------ |
| `ui/`         | shadcn 기본 컴포넌트, 순수 UI | 비즈니스 로직, API 호출  |
| `layout/`     | 헤더, 푸터, 컨테이너          | 페이지별 특정 로직       |
| `navigation/` | 메뉴, 브레드크럼              | 페이지 콘텐츠            |
| `sections/`   | 홈페이지 섹션 블록            | 기능성 비즈니스 컴포넌트 |
| `providers/`  | Context Provider만            | UI 렌더링                |

---

## 5. Form Implementation

### 표준 패턴: React Hook Form + Zod + Server Action

```typescript
// 1. src/lib/schemas/auth.ts — Zod 스키마 정의
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

export type LoginSchema = z.infer<typeof loginSchema>
```

```tsx
// 2. 폼 컴포넌트 — useForm + zodResolver 사용
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginSchema } from '@/lib/schemas/auth'

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginSchema) {
    // Server Action 호출
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

- **폼 에러 표시**: `<FormMessage />` 컴포넌트 반드시 포함
- **로딩 상태**: `form.formState.isSubmitting` 활용
- **토스트 알림**: `sonner`의 `toast.success()` / `toast.error()` 사용

---

## 6. Environment Variables

### 규칙

- 새 환경변수 추가 시 **반드시 `src/lib/env.ts`의 `envSchema`에 추가**
- `NEXT_PUBLIC_` 접두사: 클라이언트 노출 변수만 사용
- `.env.local`에 실제 값, `.env`에 기본값/예시 관리

### env.ts 수정 패턴

```typescript
// src/lib/env.ts — 새 변수 추가 예시
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  // ✅ 새 변수 추가
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
})
```

---

## 7. Routing & Pages

### PRD 기반 전체 라우트 구조

| 라우트                   | 페이지               | 접근 권한        |
| ------------------------ | -------------------- | ---------------- |
| `/`                      | 홈/랜딩              | 공개             |
| `/login`                 | 로그인               | 비로그인만       |
| `/signup`                | 회원가입             | 비로그인만       |
| `/dashboard`             | 견적서 목록 대시보드 | 로그인 필수      |
| `/invoices/new`          | 견적서 생성          | 로그인 필수      |
| `/invoices/[id]/preview` | 견적서 미리보기      | 로그인 필수      |
| `/view/[token]`          | 견적서 뷰어          | 공개 (토큰 검증) |

### 라우트 보호 규칙

- 보호 라우트는 `src/middleware.ts`에서 처리
- `(dashboard)` 그룹 레이아웃에서 인증 상태 확인
- `/view/[token]`은 서버에서 토큰 유효성 검증 후 렌더링

### 새 페이지 추가 시

```bash
# 정적 페이지
src/app/[route]/page.tsx

# 동적 라우트
src/app/invoices/[id]/preview/page.tsx

# 라우트 그룹 (URL에 미포함)
src/app/(dashboard)/dashboard/page.tsx
```

---

## 8. Styling Rules

### TailwindCSS v4 사용법

```tsx
// ✅ cn() 유틸리티 항상 사용 (조건부 클래스 포함)
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class another-class',
  isActive && 'active-class',
  className,  // 외부 className prop 마지막에 추가
)} />

// ❌ 금지 — 인라인 스타일, 동적 문자열 조합
<div style={{ color: 'red' }} />
<div className={`text-${color}-500`} />  // Tailwind purge 안 됨
```

### 다크모드

- `ThemeProvider`가 `src/app/layout.tsx`에 이미 설정됨
- 다크모드 스타일: `dark:` 접두사 사용
- 테마 색상: CSS 변수 (`--background`, `--foreground` 등) 활용

### 반응형

- 모바일 퍼스트 작성: 기본 → `sm:` → `md:` → `lg:` 순서
- 모바일 네비게이션: `mobile-nav.tsx` 사용 (Sheet 기반)

---

## 9. Multi-file Coordination (동시 수정 필요)

| 이 파일을 수정하면                        | 함께 수정해야 할 파일                                |
| ----------------------------------------- | ---------------------------------------------------- |
| 새 환경변수 `.env.local` 추가             | `src/lib/env.ts` (envSchema에 추가)                  |
| 새 shadcn 컴포넌트 추가                   | `components.json`은 자동 업데이트됨 (수동 수정 금지) |
| `src/app/layout.tsx` (전역 Provider 변경) | 모든 페이지 영향 — 사전 검토 필수                    |
| Zod 스키마 (`src/lib/schemas/*.ts`) 변경  | 해당 스키마를 사용하는 폼 컴포넌트와 API Route       |
| Zustand 스토어 타입 변경                  | 해당 스토어를 사용하는 모든 컴포넌트                 |
| `src/middleware.ts` (보호 라우트 변경)    | `src/app/(dashboard)/layout.tsx` 인증 로직           |
| PRD 기능 명세 변경                        | `docs/PRD.md` 업데이트                               |

---

## 10. AI Decision Tree

### 컴포넌트 위치 결정

```
새 컴포넌트를 어디에 배치할까?
│
├── shadcn/ui 기본 컴포넌트인가?
│   └── YES → npx shadcn@latest add, src/components/ui/
│
├── 하나의 페이지에서만 사용되는가?
│   └── YES → 해당 페이지 폴더 내 _components/ 또는 src/components/ 루트
│
├── 여러 페이지의 레이아웃 관련인가?
│   └── YES → src/components/layout/
│
├── 네비게이션 관련인가?
│   └── YES → src/components/navigation/
│
└── 여러 페이지에서 재사용되는 비즈니스 컴포넌트?
    └── YES → src/components/[기능명]-[역할].tsx
```

### Server Component vs Client Component

```
'use client' 지시어가 필요한가?
│
├── useState, useEffect, useRef 등 React hook 사용 → YES
├── onClick, onChange 등 이벤트 핸들러 사용 → YES
├── 브라우저 API (window, document) 사용 → YES
└── 위 항목 해당 없음 → NO (Server Component 유지)
```

### 새 기능 구현 우선순위

1. PRD 문서(`docs/PRD.md`)에서 기능 ID 확인
2. 기존 Zod 스키마 재사용 가능한지 확인 (`src/lib/schemas/`)
3. 기존 컴포넌트 조합으로 구현 가능한지 먼저 시도
4. shadcn 컴포넌트 추가 필요 시 `npx shadcn@latest add` 사용
5. 새 외부 패키지 추가는 사용자 승인 후 진행

---

## 11. Prohibited Actions

- **`any` 타입 사용 금지** — 반드시 명확한 타입 정의
- **상대 경로 import 금지** — 항상 `@/` 별칭 사용 (동일 파일 내 CSS 제외)
- **`src/components/ui/` 직접 비즈니스 로직 추가 금지** — wrapper 컴포넌트 생성
- **`console.log` 프로덕션 코드 금지** — 디버깅 후 반드시 제거
- **인라인 스타일 금지** — TailwindCSS 클래스 사용
- **동적 Tailwind 클래스 조합 금지** — `` `text-${color}-500` `` 형태 금지
- **단일 파일 300줄 초과 금지** — 분할 필요
- **`components.json` 직접 수정 금지** — shadcn CLI로만 관리
- **`src/app/layout.tsx` 경솔한 수정 금지** — 전역 영향 검토 후 수정
- **환경변수를 `env.ts` 거치지 않고 직접 `process.env` 접근 금지**

---

## 12. Pre-task Checklist

작업 시작 전 확인:

- [ ] `docs/PRD.md`에서 기능 ID 및 요구사항 확인
- [ ] 기존 컴포넌트/스키마/유틸리티 재사용 가능 여부 확인

작업 완료 후 실행:

```bash
npm run check-all   # typecheck + lint + format:check 통합 실행 (필수)
npm run build       # 빌드 성공 확인
```
