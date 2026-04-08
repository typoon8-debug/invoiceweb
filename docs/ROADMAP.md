# 🗺️ 노션 견적서 웹 뷰어 개발 로드맵

> 노션 견적 항목을 기반으로 견적서를 생성하고, 클라이언트에게 토큰 기반 공유 링크를 제공하여 웹 열람 및 PDF 다운로드까지 지원하는 풀스택 MVP

---

## 📋 개요

**노션 견적서 웹 뷰어**는 프리랜서·소규모 사업자가 노션에서 관리하는 견적 항목을 불러와 견적서를 생성하고, 클라이언트에게 별도 로그인 없이 웹 링크로 공유할 수 있는 MVP 서비스입니다.

### 핵심 기능

| ID   | 기능명           | 설명                                            |
| ---- | ---------------- | ----------------------------------------------- |
| F001 | 노션 데이터 연동 | 노션 DB에서 품목·수량·단가 자동 불러오기        |
| F002 | 견적서 생성      | 고객 정보 + 노션 항목 조합으로 견적서 문서 생성 |
| F003 | 공유 링크 생성   | 만료 기한이 있는 고유 토큰 URL 생성             |
| F004 | 견적서 웹 뷰어   | 토큰 URL로 접속 시 견적서를 웹 페이지로 렌더링  |
| F005 | PDF 다운로드     | 뷰어 페이지에서 견적서를 PDF 파일로 저장        |
| F006 | 견적서 목록 관리 | 목록 조회, 공유 링크 상태(활성/만료) 확인       |
| F010 | 기본 인증        | 이메일+비밀번호 회원가입/로그인/로그아웃        |
| F011 | 노션 OAuth 연결  | 작성자 계정에 노션 워크스페이스 연결            |

### 페이지 목록

| 페이지          | 경로                     | 기능       | 인증      |
| --------------- | ------------------------ | ---------- | --------- |
| 로그인          | `/login`                 | F010       | 불필요    |
| 회원가입        | `/signup`                | F010       | 불필요    |
| 대시보드        | `/dashboard`             | F006, F011 | 필요      |
| 견적서 생성     | `/invoices/new`          | F001, F002 | 필요      |
| 견적서 미리보기 | `/invoices/[id]/preview` | F002, F003 | 필요      |
| 견적서 뷰어     | `/view/[token]`          | F004, F005 | 토큰 기반 |
| 링크 만료 안내  | `/expired`               | -          | 불필요    |

---

## 🏗️ 개발 아키텍처 원칙

이 로드맵은 **공통 기반 우선(Foundation-First)** 전략을 따릅니다.
개별 기능은 반드시 공통 기반 위에서만 구현하여 재사용성, 일관성, 유지보수성을 확보합니다.

```
Phase 1: 애플리케이션 골격        ← 뼈대 (라우팅, 타입, 환경)
         ↓
Phase 2: 공통 UI 컴포넌트 시스템  ← 재사용 가능한 UI 블록
         ↓
Phase 3: 공통 API 레이어 & 서비스 ← 데이터 접근 추상화
         ↓
Phase 4: 개별 기능 구현           ← 공통 기반 위에 조립
         ↓
Phase 5: 통합 E2E 테스트          ← Playwright MCP 전수 검증
         ↓
Phase 6: 최적화 & 배포
```

> **규칙**: Phase N의 작업은 Phase N-1이 완료된 후 시작합니다.
> Phase 3 이후 API/비즈니스 로직을 포함하는 모든 Task는 구현 후 Playwright MCP 테스트가 필수입니다.

---

## 🔄 개발 워크플로우

### 1단계 - 작업 계획

- 기존 코드베이스 파악 및 현재 구현 상태 확인
- ROADMAP.md 업데이트 (Phase 및 Task 진행 상황 반영)
- 기술적 의존성 분석 및 개발 순서 결정

### 2단계 - 작업 생성

- `/tasks` 디렉토리에 `XXX-description.md` 형식으로 Task 파일 생성
- Task 파일 구성: 목표, 구현 체크리스트, 수락 기준, 완료 조건
- **API/비즈니스 로직 작업 시 `## 테스트 체크리스트` 섹션 필수 포함**
  - Playwright MCP 테스트 시나리오 (정상/에러/엣지 케이스) 작성

### 3단계 - 작업 구현

> **⚠️ 원칙**: 구현 직후 반드시 테스트 수행 → 테스트 통과 후 다음 단계 진행

- **[필수]** API 연동 및 비즈니스 로직 포함 Task는 Playwright MCP E2E 테스트 필수

**Playwright MCP 테스트 절차:**

```
1. mcp__playwright__browser_navigate        → 해당 페이지/엔드포인트 접근
2. mcp__playwright__browser_snapshot        → 초기 상태 스냅샷 확인
   또는 mcp__playwright__browser_take_screenshot
3. 기능 동작 수행                           → 폼 입력, 버튼 클릭, API 호출 등
4. 결과 상태 검증                           → 성공 메시지, 데이터 반영, 에러 처리 확인
5. mcp__playwright__browser_network_requests → API 요청/응답 전수 검증
6. 에러 시나리오 및 엣지 케이스 테스트      → 빈 값, 잘못된 입력, 네트워크 오류 등
```

- 테스트 실패 시 원인 분석 → 수정 → 재테스트 후 완료 처리

### 4단계 - 로드맵 업데이트

- 완료된 Task를 ✅로 표시
- 완료된 Task에 `See: /tasks/XXX-xxx.md` 참조 링크 추가
- Phase 전체 완료 시 Phase 제목에 ✅ 추가

---

## 🗓️ 개발 단계

---

### Phase 1: 애플리케이션 골격 구축

> **목표**: 전체 프로젝트의 디렉토리 구조, 라우팅, 공통 타입, 환경 설정을 확립한다.
> 이 단계의 결과물이 이후 모든 Phase의 기반이 된다.

---

#### Task 001: 디렉토리 구조 및 라우팅 설계 - 우선순위

> 전체 애플리케이션의 폴더 구조와 7개 페이지 라우트 플레이스홀더를 생성한다.
> 이후 모든 작업이 이 구조 안에서 이루어진다.

- [ ] 디렉토리 구조 확정 및 생성

  ```
  src/
  ├── app/                          # Next.js App Router 페이지
  │   ├── (auth)/                   # 인증 페이지 그룹
  │   │   ├── login/page.tsx
  │   │   └── signup/page.tsx
  │   ├── (protected)/              # 인증 필요 페이지 그룹
  │   │   ├── dashboard/page.tsx
  │   │   └── invoices/
  │   │       └── new/page.tsx
  │   │       └── [id]/preview/page.tsx
  │   ├── view/[token]/page.tsx     # 공개 뷰어 (토큰 기반)
  │   ├── expired/page.tsx          # 링크 만료 안내
  │   └── api/                      # API Routes
  │       ├── notion/callback/route.ts
  │       └── pdf/[token]/route.ts
  ├── components/
  │   ├── ui/                       # shadcn/ui 기본 컴포넌트 (자동 생성)
  │   ├── common/                   # 프로젝트 공통 컴포넌트
  │   ├── layout/                   # 레이아웃 컴포넌트
  │   └── invoice/                  # 견적서 도메인 컴포넌트
  ├── lib/
  │   ├── supabase/                 # Supabase 클라이언트
  │   ├── notion/                   # Notion API 서비스
  │   ├── repositories/             # 데이터 접근 레이어 (Repository 패턴)
  │   ├── services/                 # 비즈니스 로직 서비스
  │   ├── actions/                  # Server Actions
  │   ├── schemas/                  # Zod 스키마
  │   └── utils/                    # 순수 유틸리티 함수
  ├── types/                        # TypeScript 타입 정의
  └── middleware.ts                 # Next.js 미들웨어
  ```

- [ ] 7개 페이지 `page.tsx` 플레이스홀더 생성 (빈 껍데기 컴포넌트)
- [ ] Next.js 미들웨어 파일 생성 (`middleware.ts`) - 라우트 보호 구조만 정의
- [ ] 환경 변수 명세 작성 (`.env.local.example`)
  - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - Notion: `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET`, `NOTION_REDIRECT_URI`
  - App: `NEXT_PUBLIC_APP_URL`

---

#### Task 002: 공통 타입 시스템 정의

> 전체 애플리케이션에서 사용할 TypeScript 타입과 Zod 스키마를 한 곳에서 관리한다.
> 타입을 먼저 정의함으로써 팀 전체가 동일한 데이터 계약을 기반으로 작업한다.

- [ ] 도메인 타입 정의 (`src/types/domain.ts`)

  ```typescript
  // 핵심 도메인 모델
  interface User {
    id
    email
    name
    notionAccessToken
    createdAt
  }
  interface Invoice {
    id
    userId
    clientName
    clientContact
    validUntil
    totalAmount
    shareToken
    tokenExpiresAt
    createdAt
  }
  interface InvoiceItem {
    id
    invoiceId
    name
    quantity
    unitPrice
    notionPageId
  }

  // 공유 링크 상태
  type ShareLinkStatus = 'active' | 'expired' | 'invalid'
  type InvoiceWithItems = Invoice & { items: InvoiceItem[] }
  type InvoiceWithStatus = Invoice & { linkStatus: ShareLinkStatus }
  ```

- [ ] API 공통 응답 타입 정의 (`src/types/api.ts`)

  ```typescript
  // 모든 API/Server Action 결과에 사용하는 표준 타입
  type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string }
  type PaginatedResult<T> = ApiResult<{
    items: T[]
    total: number
    page: number
  }>
  ```

- [ ] 폼 입력 타입 정의 (`src/types/forms.ts`)
  - `LoginFormValues`, `SignupFormValues`
  - `InvoiceCreateFormValues`, `InvoiceItemFormValues`

- [ ] Zod 스키마 정의 (`src/lib/schemas/`)
  - `auth.schema.ts`: 로그인/회원가입 폼 스키마
  - `invoice.schema.ts`: 견적서 생성 폼 스키마, 공유 링크 스키마

- [ ] Supabase 데이터베이스 스키마 SQL 작성 (`supabase/migrations/`)
  - `001_create_tables.sql`: users, invoices, invoice_items 테이블
  - `002_rls_policies.sql`: Row Level Security 정책
    - 작성자 본인 데이터만 접근 가능 (invoices, invoice_items)
    - 뷰어 페이지: shareToken 기반 공개 읽기 허용

---

#### Task 003: 인프라 기반 구축

> Supabase 연결, 환경 변수, 미들웨어를 실제로 동작하도록 구성한다.
> 이 단계 이후 모든 서비스는 이 인프라를 통해 데이터에 접근한다.

- [ ] Supabase 프로젝트 생성 및 DB 마이그레이션 실행
- [ ] Supabase 클라이언트 팩토리 구현 (`src/lib/supabase/`)
  - `client.ts`: 브라우저용 싱글톤 클라이언트
  - `server.ts`: Server Component/Action용 클라이언트 (쿠키 기반)
  - `middleware.ts`: 미들웨어용 클라이언트
- [ ] Next.js 미들웨어 인증 로직 구현 (`src/middleware.ts`)
  - 보호된 라우트 (`/dashboard`, `/invoices/*`) → 비인증 시 `/login` 리디렉션
  - 인증된 사용자가 `/login`, `/signup` 접근 시 `/dashboard` 리디렉션
- [ ] RLS 정책 적용 및 Supabase 대시보드에서 검증

---

### Phase 2: 공통 UI 컴포넌트 시스템

> **목표**: 모든 페이지에서 재사용할 UI 블록을 먼저 구축한다.
> 개별 기능 페이지는 이 컴포넌트들을 조립하여 구성한다.
> 더미 데이터로 컴포넌트를 먼저 완성하고, 실제 연동은 Phase 4에서 수행한다.

---

#### Task 004: 공통 UI 컴포넌트 라이브러리

> 프로젝트 전반에서 반복 사용되는 UI 블록을 표준화한다.
> 각 컴포넌트는 Props 타입이 명확히 정의되어야 하며, 독립적으로 동작해야 한다.

- [ ] 피드백 컴포넌트 (`src/components/common/`)
  - `LoadingSpinner`: 로딩 상태 표시 (크기 variant: sm/md/lg)
  - `ErrorMessage`: 에러 메시지 표시 (icon + message)
  - `EmptyState`: 빈 목록 안내 (icon + title + description + CTA 슬롯)
  - `ConfirmDialog`: 확인/취소 모달 (shadcn Dialog 래퍼)
  - `CopyButton`: 클립보드 복사 버튼 (복사 완료 상태 피드백 포함)
  - `StatusBadge`: 상태 뱃지 (`active` | `expired` | `invalid` → 색상 자동 매핑)

- [ ] 견적서 도메인 컴포넌트 (`src/components/invoice/`)
  - `InvoiceHeader`: 회사명, 견적일, 유효기간 헤더 섹션
  - `InvoiceTable`: 품목·수량·단가·소계 테이블 (읽기 전용 / 편집 가능 모드)
  - `InvoiceSummary`: 소계·부가세·합계 요약 컴포넌트
  - `InvoiceDocument`: 위 세 컴포넌트를 조합한 완성 견적서 레이아웃 (뷰어·미리보기 공용)

- [ ] 노션 연동 컴포넌트 (`src/components/common/`)
  - `NotionConnectionCard`: 노션 연결 상태 카드 (연결됨/미연결 상태 표시)

- [ ] 공통 유틸리티 함수 (`src/lib/utils/`)
  - `formatCurrency(amount)`: 한국 원화 포맷 (예: `1,000,000원`)
  - `formatDate(date)`: 날짜 포맷 (예: `2026년 04월 07일`)
  - `isTokenExpired(tokenExpiresAt)`: 토큰 만료 여부 확인
  - `getLinkStatus(tokenExpiresAt)`: `ShareLinkStatus` 반환

---

#### Task 005: 레이아웃 시스템

> 세 가지 레이아웃 컨텍스트(인증 후/인증 전/공개)를 명확히 분리한다.
> 페이지는 레이아웃을 선택하기만 하면 일관된 UI가 자동으로 적용된다.

- [ ] 인증된 사용자 레이아웃 (`src/components/layout/AuthenticatedLayout/`)
  - 상단 헤더 (로고, 네비게이션, 로그아웃 버튼)
  - 사이드바 또는 탑 네비게이션 (대시보드, 새 견적서)
  - 메인 콘텐츠 영역 (Slot)
  - App Router 그룹 `(protected)/layout.tsx`에 적용

- [ ] 인증 페이지 레이아웃 (`src/components/layout/AuthLayout/`)
  - 중앙 정렬 카드 레이아웃 (로그인/회원가입 전용)
  - App Router 그룹 `(auth)/layout.tsx`에 적용

- [ ] 공개 뷰어 레이아웃 (`src/components/layout/PublicLayout/`)
  - 최소화된 헤더 (서비스명만 표시)
  - 견적서 렌더링에 최적화된 콘텐츠 영역
  - 인쇄 최적화 CSS (`@media print` 적용)

---

#### Task 006: 공통 폼 시스템

> React Hook Form + Zod 기반의 폼 패턴을 표준화한다.
> 모든 폼은 이 공통 시스템 위에서 구현되어 일관된 UX와 검증 로직을 제공한다.

- [ ] 폼 공통 컴포넌트 (`src/components/common/form/`)
  - `FormFieldWrapper`: label + input + error message를 묶는 래퍼 컴포넌트
  - `SubmitButton`: 로딩 상태(isPending)를 내장한 제출 버튼
  - `FormErrorAlert`: 서버 에러 메시지를 표시하는 Alert 컴포넌트

- [ ] 공통 폼 훅 (`src/lib/hooks/`)
  - `useFormAction<T>`: Server Action 결과를 React Hook Form과 연결하는 커스텀 훅
    - 성공 시 콜백 실행, 실패 시 `setError` 자동 처리
    - `isPending` 상태 제공

- [ ] 인라인 편집 컴포넌트
  - `EditableCell`: 견적서 생성 페이지의 수량·단가 인라인 편집 셀
  - `EditableTable`: `EditableCell`을 포함한 편집 가능 테이블 (`InvoiceTable` 편집 모드)

---

### Phase 3: 공통 API 레이어 & 서비스 모듈

> **목표**: 데이터 접근과 비즈니스 로직을 추상화하여 개별 기능이 "어떻게 가져오는지"가 아닌 "무엇을 하는지"에 집중할 수 있게 한다.
> Repository → Service → Server Action의 3계층 구조로 역할을 분리한다.

```
Server Action (입력 검증 + 권한 확인)
    ↓
Service (비즈니스 로직)
    ↓
Repository (DB/외부 API 접근)
    ↓
Supabase / Notion API
```

---

#### Task 007: 데이터 접근 레이어 (Repository 패턴)

> DB 쿼리 로직을 Repository로 캡슐화한다.
> Service와 Action은 DB를 직접 참조하지 않고 Repository를 통해서만 접근한다.

- [ ] `UserRepository` (`src/lib/repositories/user.repository.ts`)
  - `findById(id)`: 사용자 조회
  - `updateNotionToken(userId, token)`: 노션 토큰 저장/삭제
  - `clearNotionToken(userId)`: 노션 연결 해제

- [ ] `InvoiceRepository` (`src/lib/repositories/invoice.repository.ts`)
  - `findAllByUserId(userId)`: 사용자의 견적서 목록 조회
  - `findById(id, userId)`: 단일 견적서 조회 (소유권 검증 포함)
  - `findByToken(token)`: 공개 토큰으로 견적서 조회
  - `create(data)`: 견적서 + 항목 트랜잭션 생성
  - `updateShareToken(id, token, expiresAt)`: 공유 토큰 갱신

- [ ] `InvoiceItemRepository` (`src/lib/repositories/invoice-item.repository.ts`)
  - `findByInvoiceId(invoiceId)`: 견적서의 항목 목록 조회
  - `bulkCreate(invoiceId, items)`: 항목 일괄 생성
  - `bulkUpdate(invoiceId, items)`: 항목 일괄 수정

---

#### Task 008: 인증 서비스 레이어

> 인증 관련 비즈니스 로직을 서비스로 캡슐화한다.
> 모든 인증 기능은 이 서비스를 통해서만 수행된다.

- [ ] `AuthService` (`src/lib/services/auth.service.ts`)
  - `signUp(email, password, name)`: 회원가입 → User 반환
  - `signIn(email, password)`: 로그인 → Session 반환
  - `signOut()`: 로그아웃
  - `getSession()`: 현재 세션 조회
  - `getCurrentUser()`: 현재 인증된 사용자 조회

- [ ] 인증 Server Actions (`src/lib/actions/auth.actions.ts`)
  - `signUpAction(formData)`: Zod 검증 → `AuthService.signUp()` 호출 → `ApiResult<User>` 반환
  - `signInAction(formData)`: Zod 검증 → `AuthService.signIn()` 호출 → `ApiResult<Session>` 반환
  - `signOutAction()`: `AuthService.signOut()` 호출 → 로그인 페이지 리디렉션

- [ ] **[구현 후 테스트 필수]** Playwright MCP 테스트

  ```
  [정상 플로우]
  - 회원가입 폼 제출 → 대시보드 리디렉션 확인
  - 로그인 폼 제출 → 대시보드 리디렉션 확인
  - 로그아웃 버튼 클릭 → 로그인 페이지 리디렉션 확인
  - network_requests로 Supabase auth API 요청/응답 검증

  [에러 플로우]
  - 잘못된 이메일 형식 → 폼 유효성 에러 표시 확인
  - 존재하지 않는 계정 로그인 → 에러 메시지 확인
  - 이미 가입된 이메일 재가입 → 중복 에러 확인
  - 비밀번호 불일치 → 에러 확인

  [엣지 케이스]
  - 비인증 상태로 /dashboard 직접 접근 → /login 리디렉션 확인
  - 인증 상태로 /login 접근 → /dashboard 리디렉션 확인
  ```

---

#### Task 009: 노션 API 서비스 레이어

> Notion API 호출을 캡슐화하고 일관된 에러 핸들링을 제공한다.
> OAuth 플로우와 데이터 조회 로직을 명확히 분리한다.

- [ ] `NotionOAuthService` (`src/lib/services/notion-oauth.service.ts`)
  - `getAuthorizationUrl()`: OAuth 인가 URL 생성
  - `exchangeCode(code)`: 인가 코드 → 액세스 토큰 교환
  - `revokeToken(userId)`: 연결 해제

- [ ] `NotionDataService` (`src/lib/services/notion-data.service.ts`)
  - `getDatabases(accessToken)`: 연결된 DB 목록 조회
  - `getDatabaseItems(accessToken, databaseId)`: DB 항목 조회
  - `mapToInvoiceItems(notionItems)`: Notion 응답 → `InvoiceItem[]` 변환
    - 필수 필드 누락 시 경고 처리 (품목명, 수량, 단가)

- [ ] 노션 관련 Server Actions (`src/lib/actions/notion.actions.ts`)
  - `connectNotionAction()`: OAuth 인가 URL 생성 → 리디렉션
  - `disconnectNotionAction()`: `UserRepository.clearNotionToken()` 호출
  - `getNotionDatabasesAction()`: DB 목록 조회 → `ApiResult<NotionDatabase[]>` 반환
  - `getNotionDatabaseItemsAction(databaseId)`: 항목 조회 → `ApiResult<InvoiceItem[]>` 반환

- [ ] 노션 OAuth 콜백 Route 구현 (`src/app/api/notion/callback/route.ts`)
  - 인가 코드 수신 → `NotionOAuthService.exchangeCode()` 호출
  - `UserRepository.updateNotionToken()` 으로 토큰 저장
  - 대시보드 리디렉션

- [ ] **[구현 후 테스트 필수]** Playwright MCP 테스트

  ```
  [정상 플로우]
  - "노션 연결하기" 클릭 → OAuth 리디렉션 확인
  - OAuth 승인 후 콜백 처리 → 대시보드 복귀 + 연결 상태 표시 확인
  - DB 목록 로드 → 드롭다운 표시 확인
  - DB 선택 → 항목 자동 로드 확인
  - network_requests로 Notion API 요청 헤더(Authorization 토큰) 검증

  [에러 플로우]
  - OAuth 승인 취소 → 미연결 상태 유지 확인
  - 만료된 노션 토큰 → 재연결 안내 표시 확인
  - 노션 API Rate Limit → 에러 메시지 표시 확인

  [엣지 케이스]
  - 노션 미연결 상태로 견적서 생성 접근 → 연결 안내 모달 표시 확인
  - 빈 DB 선택 시 빈 항목 목록 표시 확인
  - 필수 필드 없는 DB 항목 → 경고 메시지 표시 확인
  ```

---

#### Task 010: 견적서 서비스 레이어 및 공유 토큰 모듈

> 견적서 생성, 공유 링크 생성, 토큰 검증 비즈니스 로직을 서비스로 캡슐화한다.
> 토큰 모듈은 단독 유틸리티로 분리하여 독립적으로 테스트 가능하게 한다.

- [ ] 공유 토큰 유틸리티 (`src/lib/utils/token.ts`)
  - `generateToken()`: `nanoid` 기반 고유 토큰 생성
  - `calculateExpiry(days)`: 만료일 계산 (기본 30일)
  - `validateToken(token, expiresAt)`: 유효성 검사 → `ShareLinkStatus` 반환

- [ ] `InvoiceService` (`src/lib/services/invoice.service.ts`)
  - `createInvoice(userId, formData)`: 견적서 + 항목 생성 → `InvoiceWithItems` 반환
  - `generateShareLink(invoiceId, userId)`: 토큰 생성 + DB 저장 → 공유 URL 반환
  - `getInvoiceList(userId)`: 목록 조회 + 링크 상태 계산 → `InvoiceWithStatus[]` 반환
  - `getInvoiceById(invoiceId, userId)`: 단일 조회 (소유권 검증)
  - `getInvoiceByToken(token)`: 토큰 검증 + 견적서 조회 → 유효/만료 분기

- [ ] 견적서 Server Actions (`src/lib/actions/invoice.actions.ts`)
  - `createInvoiceAction(formData)`: Zod 검증 → `InvoiceService.createInvoice()` → 미리보기 리디렉션
  - `generateShareLinkAction(invoiceId)`: `InvoiceService.generateShareLink()` → `ApiResult<string>` 반환
  - `getInvoiceListAction()`: `InvoiceService.getInvoiceList()` → `ApiResult<InvoiceWithStatus[]>` 반환
  - `getInvoiceByIdAction(invoiceId)`: `InvoiceService.getInvoiceById()` → `ApiResult<InvoiceWithItems>` 반환

- [ ] **[구현 후 테스트 필수]** Playwright MCP 테스트

  ```
  [정상 플로우]
  - 견적서 생성 폼 제출 → 미리보기 페이지 이동 확인
  - 미리보기 페이지 데이터 정상 렌더링 확인 (스크린샷)
  - "공유 링크 생성" 클릭 → 토큰 URL 표시 확인
  - 링크 복사 버튼 클릭 → 클립보드 저장 Toast 확인
  - network_requests로 견적서 생성 POST 요청/응답 검증
  - 대시보드에서 새 견적서 목록 반영 및 상태 뱃지 확인

  [에러 플로우]
  - 고객사명 누락 → 폼 유효성 에러 확인
  - 견적 항목 없이 제출 → 에러 메시지 확인
  - 네트워크 오류 시 재시도 안내 확인

  [엣지 케이스]
  - 수량 0 입력 시 합계 계산 확인
  - 단가 1억 원 이상 포맷 확인
  - 유효기간 과거 날짜 입력 → 유효성 에러 확인
  ```

---

### Phase 4: 개별 기능 구현

> **목표**: Phase 1~3에서 구축한 공통 기반을 조립하여 각 페이지의 실제 기능을 완성한다.
> 각 Task는 새로운 코드를 최소화하고 공통 기반을 최대한 활용한다.

---

#### Task 011: 인증 페이지 기능 완성 (F010)

> `AuthService` + `signUpAction`/`signInAction` + 공통 폼 시스템을 조립한다.

- [ ] 로그인 페이지 (`/login`)
  - `useFormAction` 훅 + `signInAction` 연결
  - `FormFieldWrapper` 컴포넌트로 이메일/비밀번호 필드 구성
  - `FormErrorAlert`로 서버 에러 표시
  - `SubmitButton` (isPending 로딩 상태)
  - 회원가입 페이지 이동 링크

- [ ] 회원가입 페이지 (`/signup`)
  - `useFormAction` 훅 + `signUpAction` 연결
  - 이름/이메일/비밀번호/비밀번호 확인 필드
  - 비밀번호 일치 검사 (Zod `refine`)
  - 로그인 페이지 이동 링크

---

#### Task 012: 대시보드 기능 완성 (F006, F011)

> `InvoiceService.getInvoiceList()` + 노션 연결 상태 + 공통 컴포넌트를 조립한다.

- [ ] 대시보드 페이지 (`/dashboard`)
  - 견적서 목록 서버 컴포넌트 (Suspense + `getInvoiceListAction()`)
  - `StatusBadge`로 공유 링크 활성/만료 상태 표시
  - `CopyButton`으로 공유 링크 클립보드 복사
  - `EmptyState`로 견적서 없을 때 안내 (새 견적서 만들기 CTA)
  - `NotionConnectionCard`로 노션 연결 상태 표시 및 연결/해제 버튼

---

#### Task 013: 견적서 생성 기능 완성 (F001, F002)

> `NotionDataService` + `InvoiceService` + `EditableTable` + 공통 폼 시스템을 조립한다.

- [ ] 견적서 생성 페이지 (`/invoices/new`)
  - 노션 DB 목록 드롭다운 (`getNotionDatabasesAction()`)
  - DB 선택 시 항목 자동 로드 (`getNotionDatabaseItemsAction()`)
  - `EditableTable`로 품목·수량·단가 인라인 수정
  - 합계 금액 실시간 계산 (클라이언트 컴포넌트)
  - 고객 정보 입력 폼 (고객사명, 담당자, 유효기간)
  - "미리보기" 버튼 → `createInvoiceAction()` 제출 → 미리보기 페이지 이동
  - 노션 미연결 상태 → `ConfirmDialog`로 연결 안내

---

#### Task 014: 견적서 미리보기 및 공유 링크 기능 완성 (F002, F003)

> `InvoiceDocument` + `generateShareLinkAction()` + `CopyButton`을 조립한다.

- [ ] 견적서 미리보기 페이지 (`/invoices/[id]/preview`)
  - `getInvoiceByIdAction()` 으로 데이터 로드 (서버 컴포넌트)
  - `InvoiceDocument` 컴포넌트로 최종 렌더링
  - "공유 링크 생성" 버튼 → `generateShareLinkAction()` 호출
  - 생성된 링크 표시 + `CopyButton` 복사
  - "이전 단계(수정)" 버튼

---

#### Task 015: 견적서 뷰어 및 PDF 다운로드 기능 완성 (F004, F005)

> `InvoiceService.getInvoiceByToken()` + `InvoiceDocument` + PDF 생성을 조립한다.

- [ ] 공개 견적서 조회 API Route (`src/app/api/view/[token]/route.ts`)
  - 토큰 검증 → 유효: 견적서 데이터 반환 / 무효·만료: 410/404 응답

- [ ] 견적서 뷰어 페이지 (`/view/[token]`)
  - 서버 컴포넌트에서 토큰 검증 → 무효 시 `/expired` 리디렉션
  - `PublicLayout` 적용
  - `InvoiceDocument` 컴포넌트 (읽기 전용 모드)
  - "PDF 다운로드" 버튼

- [ ] PDF 다운로드 구현
  - **Option A**: `@react-pdf/renderer` 클라이언트 사이드 PDF 생성
  - **Option B**: Puppeteer API Route (`/api/pdf/[token]`) 서버 사이드 PDF 생성
  - 파일명 규칙: `견적서_[클라이언트명]_[날짜].pdf`
  - `@media print` CSS 최적화 (A4 용지, 불필요한 버튼 숨김)

- [ ] 링크 만료 안내 페이지 (`/expired`)
  - 만료/무효 안내 메시지
  - 작성자에게 재요청 안내 문구

- [ ] **[구현 후 테스트 필수]** Playwright MCP 테스트

  ```
  [정상 플로우]
  - 유효한 토큰 URL 접속 → 견적서 정상 렌더링 확인 (스크린샷)
  - 비로그인 상태로 접근 가능 여부 확인
  - "PDF 다운로드" 클릭 → 파일 다운로드 시작 확인
  - network_requests로 토큰 검증 API 요청/응답 확인

  [에러 플로우]
  - 만료된 토큰 URL → /expired 리디렉션 확인
  - 존재하지 않는 토큰 → /expired 리디렉션 확인

  [엣지 케이스]
  - 견적 항목 10개 이상 → PDF 페이지 분할 확인
  - 모바일 뷰포트(375px)에서 뷰어 렌더링 확인
  ```

---

### Phase 5: 통합 E2E 테스트 (Playwright MCP)

> **목표**: 개별 기능 테스트를 넘어 전체 사용자 여정을 처음부터 끝까지 통합 검증한다.

---

#### Task 016: 전체 사용자 여정 E2E 통합 테스트

- [ ] **작성자 전체 여정 테스트**

  ```
  시나리오 1: 신규 사용자 전체 플로우
  1. /signup → 회원가입 폼 입력 → 제출
  2. /dashboard 자동 이동 확인
  3. "노션 연결하기" 클릭 → OAuth 플로우 완료 → 연결 상태 표시
  4. "새 견적서 만들기" 클릭 → /invoices/new 이동
  5. 노션 DB 선택 → 항목 자동 로드 → 고객 정보 입력
  6. "미리보기" 클릭 → /invoices/[id]/preview 이동
  7. 견적서 내용 확인 → "공유 링크 생성" 클릭
  8. 생성된 토큰 URL 확인 → 클립보드 복사 Toast 확인
  9. /dashboard 이동 → 견적서 목록 반영 + StatusBadge 확인
  ```

- [ ] **클라이언트 전체 여정 테스트**

  ```
  시나리오 2: 유효한 공유 링크 접속
  1. 비로그인 상태로 토큰 URL 접속 (/view/[token])
  2. 견적서 정상 렌더링 확인 (스크린샷)
  3. 데이터 검증: 클라이언트명, 품목 목록, 합계, 유효기간
  4. "PDF 다운로드" 클릭 → 파일 다운로드 확인
  5. network_requests로 API 호출 전수 검증

  시나리오 3: 만료/무효 링크 접속
  1. 만료된 토큰 URL 접속 → /expired 리디렉션 확인
  2. 만료 안내 페이지 스냅샷 검증
  ```

- [ ] **에러 및 엣지 케이스 전수 테스트**

  ```
  인증
  - 세션 없이 /dashboard 접근 → /login 리디렉션
  - 잘못된 자격증명 → 에러 메시지 표시

  노션 연동
  - 미연결 상태로 견적서 생성 → 연결 안내 모달
  - 노션 API 지연 시 로딩 상태 표시

  견적서
  - 빈 대시보드 → EmptyState 컴포넌트 표시
  - 존재하지 않는 견적서 미리보기 → 에러 처리

  뷰어
  - 토큰 만료 경계값 테스트 (만료 직전/직후)
  ```

- [ ] **반응형 레이아웃 테스트**
  - 데스크톱 (1440px): 대시보드, 뷰어 페이지 스크린샷 검증
  - 태블릿 (768px): 대시보드 레이아웃 검증
  - 모바일 (375px): 로그인, 뷰어 페이지 레이아웃 검증

---

### Phase 6: 최적화 및 배포

---

#### Task 017: 성능 최적화 및 UX 개선

- [ ] Next.js 최적화
  - PDF 라이브러리 동적 임포트 (`next/dynamic`)
  - Suspense 경계 및 스트리밍 SSR 적용
  - 페이지별 `loading.tsx` 스켈레톤 UI

- [ ] 에러 처리 강화
  - 페이지별 `error.tsx` 에러 경계
  - API 에러 코드별 사용자 친화적 메시지 매핑

- [ ] 접근성 개선
  - 키보드 네비게이션 확인
  - ARIA 레이블 보완

---

#### Task 018: 배포 파이프라인 및 모니터링 구축

- [ ] Vercel 배포 설정
  - 환경 변수 등록 (dev/prod 분리)
  - Preview 배포 (PR별 자동 배포)
  - Production 브랜치 설정 (`main`)

- [ ] Supabase 프로덕션 환경 설정
  - dev/prod 프로젝트 분리
  - 마이그레이션 자동화 설정
  - 백업 정책 확인

- [ ] 기본 모니터링 구성
  - Vercel Analytics 활성화
  - Supabase 대시보드 알림 설정

- [ ] 보안 점검
  - RLS 정책 최종 검증
  - 환경 변수 노출 여부 확인
  - CORS 정책 설정
  - 노션 액세스 토큰 암호화 저장 검토

---

## 📊 진행 현황 요약

| Phase   | 설명                             | 상태    |
| ------- | -------------------------------- | ------- |
| Phase 1 | 애플리케이션 골격 구축           | 대기 중 |
| Phase 2 | 공통 UI 컴포넌트 시스템          | 대기 중 |
| Phase 3 | 공통 API 레이어 & 서비스 모듈    | 대기 중 |
| Phase 4 | 개별 기능 구현                   | 대기 중 |
| Phase 5 | 통합 E2E 테스트 (Playwright MCP) | 대기 중 |
| Phase 6 | 최적화 및 배포                   | 대기 중 |

| Task     | 설명                                               | 상태       |
| -------- | -------------------------------------------------- | ---------- |
| Task 001 | 디렉토리 구조 및 라우팅 설계                       | - 우선순위 |
| Task 002 | 공통 타입 시스템 정의                              | 대기 중    |
| Task 003 | 인프라 기반 구축 (Supabase + 미들웨어)             | 대기 중    |
| Task 004 | 공통 UI 컴포넌트 라이브러리                        | 대기 중    |
| Task 005 | 레이아웃 시스템                                    | 대기 중    |
| Task 006 | 공통 폼 시스템                                     | 대기 중    |
| Task 007 | 데이터 접근 레이어 (Repository 패턴)               | 대기 중    |
| Task 008 | 인증 서비스 레이어                                 | 대기 중    |
| Task 009 | 노션 API 서비스 레이어                             | 대기 중    |
| Task 010 | 견적서 서비스 레이어 및 공유 토큰 모듈             | 대기 중    |
| Task 011 | 인증 페이지 기능 완성 (F010)                       | 대기 중    |
| Task 012 | 대시보드 기능 완성 (F006, F011)                    | 대기 중    |
| Task 013 | 견적서 생성 기능 완성 (F001, F002)                 | 대기 중    |
| Task 014 | 견적서 미리보기 및 공유 링크 기능 완성 (F003)      | 대기 중    |
| Task 015 | 견적서 뷰어 및 PDF 다운로드 기능 완성 (F004, F005) | 대기 중    |
| Task 016 | 전체 사용자 여정 E2E 통합 테스트                   | 대기 중    |
| Task 017 | 성능 최적화 및 UX 개선                             | 대기 중    |
| Task 018 | 배포 파이프라인 및 모니터링 구축                   | 대기 중    |

---

## 🔗 관련 문서

- **📋 프로젝트 요구사항**: `@/docs/PRD.md`
- **🤖 개발 지침**: `@/CLAUDE.md`
- **📁 프로젝트 구조**: `@/docs/guides/project-structure.md`
- **🎨 스타일링 가이드**: `@/docs/guides/styling-guide.md`
- **🧩 컴포넌트 패턴**: `@/docs/guides/component-patterns.md`
