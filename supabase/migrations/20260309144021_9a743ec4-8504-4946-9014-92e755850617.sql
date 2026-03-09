
CREATE TABLE public.powerbi_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_key text NOT NULL UNIQUE,
  workspace_id text NOT NULL,
  report_name text NOT NULL,
  embed_url text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.powerbi_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of active reports"
  ON public.powerbi_reports
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

COMMENT ON COLUMN public.powerbi_reports.report_key IS 'Chave que mapeia ao relatório no frontend (ex: 1-1, 1-2)';
COMMENT ON COLUMN public.powerbi_reports.workspace_id IS 'ID do workspace no frontend';
COMMENT ON COLUMN public.powerbi_reports.embed_url IS 'URL de embed do Power BI (Publicar na Web)';
COMMENT ON COLUMN public.powerbi_reports.is_active IS 'Se o relatório está ativo e visível';
