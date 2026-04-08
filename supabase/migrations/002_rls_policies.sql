-- Row Level Security 정책
-- 작성자: 본인 데이터만 접근 가능
-- 클라이언트: 유효한 share_token으로 견적서 공개 읽기 가능

-- users 테이블 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_insert_own ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- invoices 테이블 RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 작성자: 본인 견적서 전체 접근
CREATE POLICY invoices_owner_all ON public.invoices
  FOR ALL USING (auth.uid() = user_id);

-- 클라이언트: 유효한 토큰으로 공개 읽기
CREATE POLICY invoices_public_read_by_token ON public.invoices
  FOR SELECT USING (
    share_token IS NOT NULL
    AND token_expires_at IS NOT NULL
    AND token_expires_at > NOW()
  );

-- invoice_items 테이블 RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- 작성자: 본인 견적서의 항목 전체 접근
CREATE POLICY invoice_items_owner_all ON public.invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM public.invoices WHERE user_id = auth.uid()
    )
  );

-- 클라이언트: 유효한 토큰의 견적서 항목 공개 읽기
CREATE POLICY invoice_items_public_read_by_invoice ON public.invoice_items
  FOR SELECT USING (
    invoice_id IN (
      SELECT id FROM public.invoices
      WHERE share_token IS NOT NULL
        AND token_expires_at IS NOT NULL
        AND token_expires_at > NOW()
    )
  );
