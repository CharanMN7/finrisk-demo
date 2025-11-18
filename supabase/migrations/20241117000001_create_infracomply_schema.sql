-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id TEXT UNIQUE NOT NULL,
  borrower_name TEXT NOT NULL,
  sector TEXT NOT NULL CHECK (sector IN ('Highway', 'Power', 'Residential', 'CRE', 'Other')),
  sanction_amount DECIMAL(15, 2) NOT NULL,
  disbursed_amount DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2),
  dcco_planned DATE NOT NULL,
  dcco_actual DATE,
  dcco_status INTEGER DEFAULT 0, -- days delayed/ahead (negative = ahead, positive = delayed)
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'NPA', 'Closed')),
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_tier TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN risk_score >= 75 THEN 'Red'
      WHEN risk_score >= 40 THEN 'Yellow'
      ELSE 'Green'
    END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('DCCO Deferment', 'Cost Overrun', 'Milestone Delay', 'Document Expiry', 'Other')),
  severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Acknowledged', 'Resolved', 'Dismissed')),
  description TEXT NOT NULL,
  resolution_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_note TEXT,
  resolved_at TIMESTAMPTZ
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- in bytes
  file_url TEXT,
  document_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planned_date DATE NOT NULL,
  actual_date DATE,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Delayed')),
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create financials table
CREATE TABLE IF NOT EXISTS financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sanction_amount DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2) NOT NULL,
  cost_overrun_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN sanction_amount > 0 THEN ((actual_cost - sanction_amount) / sanction_amount * 100)
      ELSE 0
    END
  ) STORED,
  burn_rate DECIMAL(15, 2), -- crores per month
  cash_buffer_months INTEGER, -- months of runway remaining
  provision_required DECIMAL(15, 2),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  project_loan_id TEXT,
  entity_type TEXT, -- 'project', 'alert', 'document', etc.
  entity_id UUID,
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector);
CREATE INDEX IF NOT EXISTS idx_projects_risk_tier ON projects(risk_tier);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_loan_id ON projects(loan_id);

CREATE INDEX IF NOT EXISTS idx_alerts_project_id ON alerts(project_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);

CREATE INDEX IF NOT EXISTS idx_financials_project_id ON financials(project_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project_id ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financials_updated_at BEFORE UPDATE ON financials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (for demo purposes, allow all authenticated users to read/write)
CREATE POLICY "Allow authenticated users to read projects" ON projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects" ON projects
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete projects" ON projects
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read alerts" ON alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert alerts" ON alerts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update alerts" ON alerts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete alerts" ON alerts
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read documents" ON documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert documents" ON documents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update documents" ON documents
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete documents" ON documents
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read milestones" ON milestones
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert milestones" ON milestones
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update milestones" ON milestones
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete milestones" ON milestones
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read financials" ON financials
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert financials" ON financials
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update financials" ON financials
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete financials" ON financials
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read audit_logs" ON audit_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert audit_logs" ON audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Note: audit_logs should not be updatable or deletable by users

