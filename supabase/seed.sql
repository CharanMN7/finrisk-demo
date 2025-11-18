-- Seed data for InfraCOMPLY Pro demo
-- 100 projects across sectors: Highway 35%, Power 25%, Residential 20%, CRE 15%, Other 5%
-- Risk distribution: 60 green, 30 yellow, 10 red

-- Insert projects (Highway - 35 projects)
INSERT INTO projects (loan_id, borrower_name, sector, sanction_amount, disbursed_amount, actual_cost, dcco_planned, dcco_actual, dcco_status, status, risk_score) VALUES
('HWY-2023-001', 'ABC Infrastructure Ltd', 'Highway', 45000.00, 38000.00, 51300.00, '2024-03-31', '2024-07-15', 105, 'Active', 95),
('HWY-2023-002', 'National Road Builders', 'Highway', 32000.00, 28000.00, 30500.00, '2024-06-30', '2024-06-25', -5, 'Active', 25),
('HWY-2023-003', 'Express Highways Pvt Ltd', 'Highway', 58000.00, 52000.00, 56000.00, '2024-12-31', NULL, 0, 'Active', 35),
('HWY-2023-004', 'Metro Roads Corporation', 'Highway', 28000.00, 25000.00, 25800.00, '2024-05-15', '2024-05-10', -5, 'Active', 15),
('HWY-2023-005', 'Coastal Highway Developers', 'Highway', 67000.00, 60000.00, 75000.00, '2024-02-28', '2024-08-20', 174, 'Active', 98),
('HWY-2023-006', 'Urban Connectivity Ltd', 'Highway', 41000.00, 35000.00, 42500.00, '2024-09-30', NULL, 0, 'Active', 45),
('HWY-2023-007', 'Bridge Solutions India', 'Highway', 55000.00, 48000.00, 52000.00, '2024-11-30', NULL, 0, 'Active', 30),
('HWY-2023-008', 'Premier Toll Roads', 'Highway', 72000.00, 65000.00, 68000.00, '2025-01-31', NULL, 0, 'Active', 20),
('HWY-2023-009', 'Eastern Expressway Consortium', 'Highway', 45000.00, 40000.00, 41000.00, '2024-10-31', NULL, 0, 'Active', 25),
('HWY-2023-010', 'Mountain Pass Builders', 'Highway', 38000.00, 32000.00, 43000.00, '2024-04-30', '2024-09-15', 138, 'Active', 85),
('HWY-2023-011', 'Southern Highways Ltd', 'Highway', 29000.00, 26000.00, 27500.00, '2024-08-31', NULL, 0, 'Active', 22),
('HWY-2023-012', 'Rapid Transit Developers', 'Highway', 51000.00, 45000.00, 46500.00, '2024-12-15', NULL, 0, 'Active', 28),
('HWY-2023-013', 'Interstate Corridor Ltd', 'Highway', 63000.00, 58000.00, 70000.00, '2024-01-31', '2024-07-10', 161, 'Active', 90),
('HWY-2023-014', 'City Link Builders', 'Highway', 35000.00, 31000.00, 33000.00, '2024-07-31', NULL, 0, 'Active', 32),
('HWY-2023-015', 'Greenfield Roads Pvt Ltd', 'Highway', 47000.00, 42000.00, 43500.00, '2024-11-15', NULL, 0, 'Active', 26),
('HWY-2024-016', 'Skyway Constructors', 'Highway', 42000.00, 38000.00, 39000.00, '2025-02-28', NULL, 0, 'Active', 18),
('HWY-2024-017', 'Heritage Road Developers', 'Highway', 36000.00, 32000.00, 40000.00, '2024-03-15', '2024-08-25', 163, 'Active', 88),
('HWY-2024-018', 'Valley Bridge Corporation', 'Highway', 54000.00, 49000.00, 51000.00, '2024-09-15', NULL, 0, 'Active', 29),
('HWY-2024-019', 'Plateau Highways Ltd', 'Highway', 31000.00, 28000.00, 28500.00, '2024-06-15', '2024-06-10', -5, 'Active', 16),
('HWY-2024-020', 'Bypass Road Systems', 'Highway', 48000.00, 43000.00, 53000.00, '2024-02-15', '2024-07-30', 165, 'Active', 92),
('HWY-2024-021', 'Ring Road Developers', 'Highway', 39000.00, 35000.00, 36500.00, '2024-10-15', NULL, 0, 'Active', 27),
('HWY-2024-022', 'Tunnel Engineering Ltd', 'Highway', 68000.00, 62000.00, 64000.00, '2025-03-31', NULL, 0, 'Active', 24),
('HWY-2024-023', 'Metro Link Consortium', 'Highway', 44000.00, 39000.00, 48500.00, '2024-04-15', '2024-10-05', 173, 'Active', 86),
('HWY-2024-024', 'Coastal Ring Road Ltd', 'Highway', 52000.00, 47000.00, 49000.00, '2024-08-15', NULL, 0, 'Active', 31),
('HWY-2024-025', 'Urban Expressway Corp', 'Highway', 37000.00, 33000.00, 34000.00, '2024-07-15', NULL, 0, 'Active', 23),
('HWY-2024-026', 'National Bridge Builders', 'Highway', 61000.00, 56000.00, 57500.00, '2024-12-31', NULL, 0, 'Active', 28),
('HWY-2024-027', 'Corridor Developers Pvt', 'Highway', 33000.00, 29000.00, 30000.00, '2024-09-30', NULL, 0, 'Active', 21),
('HWY-2024-028', 'Gateway Highway Systems', 'Highway', 49000.00, 44000.00, 45500.00, '2024-11-30', NULL, 0, 'Active', 26),
('HWY-2024-029', 'Arterial Roads Ltd', 'Highway', 56000.00, 51000.00, 52500.00, '2025-01-15', NULL, 0, 'Active', 22),
('HWY-2024-030', 'Trans-State Builders', 'Highway', 43000.00, 38000.00, 47000.00, '2024-05-31', '2024-11-10', 163, 'Active', 78),
('HWY-2024-031', 'Riverine Highway Corp', 'Highway', 40000.00, 36000.00, 37000.00, '2024-10-31', NULL, 0, 'Active', 25),
('HWY-2024-032', 'Highland Roads Pvt Ltd', 'Highway', 46000.00, 41000.00, 50500.00, '2024-03-31', '2024-09-20', 173, 'Active', 82),
('HWY-2024-033', 'Peninsula Builders', 'Highway', 34000.00, 30000.00, 31000.00, '2024-08-31', NULL, 0, 'Active', 20),
('HWY-2024-034', 'Interstate Roads Ltd', 'Highway', 50000.00, 45000.00, 46000.00, '2024-12-15', NULL, 0, 'Active', 24),
('HWY-2024-035', 'Regional Corridor Corp', 'Highway', 38000.00, 34000.00, 42000.00, '2024-04-30', '2024-10-15', 168, 'Active', 80);

-- Insert projects (Power - 25 projects)
INSERT INTO projects (loan_id, borrower_name, sector, sanction_amount, disbursed_amount, actual_cost, dcco_planned, dcco_actual, dcco_status, status, risk_score) VALUES
('PWR-2023-001', 'Sunshine Solar Ltd', 'Power', 68000.00, 62000.00, 75000.00, '2024-01-31', '2024-06-25', 146, 'Active', 93),
('PWR-2023-002', 'Green Energy Solutions', 'Power', 52000.00, 48000.00, 50000.00, '2024-08-31', NULL, 0, 'Active', 28),
('PWR-2023-003', 'Wind Power Developers', 'Power', 78000.00, 72000.00, 74000.00, '2024-12-31', NULL, 0, 'Active', 25),
('PWR-2023-004', 'Hydro Electric Corp', 'Power', 95000.00, 88000.00, 105000.00, '2024-02-28', '2024-09-10', 195, 'Active', 97),
('PWR-2023-005', 'Thermal Power Ltd', 'Power', 82000.00, 76000.00, 78000.00, '2024-10-31', NULL, 0, 'Active', 30),
('PWR-2023-006', 'Renewable Energy India', 'Power', 64000.00, 59000.00, 60500.00, '2024-07-31', NULL, 0, 'Active', 26),
('PWR-2023-007', 'Solar Fields Pvt Ltd', 'Power', 58000.00, 53000.00, 64000.00, '2024-03-15', '2024-08-30', 168, 'Active', 87),
('PWR-2023-008', 'Wind Farm Consortium', 'Power', 71000.00, 66000.00, 68000.00, '2024-11-30', NULL, 0, 'Active', 27),
('PWR-2023-009', 'Power Grid Builders', 'Power', 46000.00, 42000.00, 43000.00, '2024-09-30', NULL, 0, 'Active', 24),
('PWR-2023-010', 'Clean Energy Corp', 'Power', 55000.00, 50000.00, 60500.00, '2024-04-30', '2024-11-15', 199, 'Active', 91),
('PWR-2024-011', 'Solar Power Systems', 'Power', 62000.00, 57000.00, 59000.00, '2024-12-15', NULL, 0, 'Active', 29),
('PWR-2024-012', 'Offshore Wind Ltd', 'Power', 89000.00, 83000.00, 85000.00, '2025-02-28', NULL, 0, 'Active', 22),
('PWR-2024-013', 'Biomass Energy Pvt', 'Power', 48000.00, 44000.00, 53000.00, '2024-05-31', '2024-12-20', 203, 'Active', 89),
('PWR-2024-014', 'Nuclear Power Corp', 'Power', 125000.00, 118000.00, 120000.00, '2025-06-30', NULL, 0, 'Active', 19),
('PWR-2024-015', 'Tidal Energy Systems', 'Power', 72000.00, 67000.00, 69000.00, '2025-01-31', NULL, 0, 'Active', 23),
('PWR-2024-016', 'Geothermal Power Ltd', 'Power', 54000.00, 49000.00, 50500.00, '2024-10-31', NULL, 0, 'Active', 27),
('PWR-2024-017', 'Smart Grid Developers', 'Power', 61000.00, 56000.00, 67000.00, '2024-03-31', '2024-10-25', 208, 'Active', 94),
('PWR-2024-018', 'Green Hydrogen Plant', 'Power', 98000.00, 92000.00, 94000.00, '2025-03-31', NULL, 0, 'Active', 21),
('PWR-2024-019', 'Solar Rooftop Systems', 'Power', 42000.00, 38000.00, 39000.00, '2024-08-15', NULL, 0, 'Active', 25),
('PWR-2024-020', 'Wind Turbine Farms', 'Power', 66000.00, 61000.00, 72500.00, '2024-04-15', '2024-11-30', 229, 'Active', 96),
('PWR-2024-021', 'Battery Storage Ltd', 'Power', 58000.00, 53000.00, 54500.00, '2024-09-30', NULL, 0, 'Active', 28),
('PWR-2024-022', 'Micro-Grid Solutions', 'Power', 45000.00, 41000.00, 42000.00, '2024-11-15', NULL, 0, 'Active', 24),
('PWR-2024-023', 'Distributed Energy Corp', 'Power', 51000.00, 47000.00, 56000.00, '2024-06-30', '2025-01-20', 204, 'Active', 84),
('PWR-2024-024', 'Cogeneration Plant Ltd', 'Power', 69000.00, 64000.00, 66000.00, '2024-12-31', NULL, 0, 'Active', 26),
('PWR-2024-025', 'Transmission Line Corp', 'Power', 53000.00, 49000.00, 50000.00, '2024-10-15', NULL, 0, 'Active', 23);

-- Insert projects (Residential - 20 projects)
INSERT INTO projects (loan_id, borrower_name, sector, sanction_amount, disbursed_amount, actual_cost, dcco_planned, dcco_actual, dcco_status, status, risk_score) VALUES
('RES-2023-001', 'Premium Homes Developers', 'Residential', 38000.00, 34000.00, 42000.00, '2024-02-28', '2024-07-15', 138, 'Active', 76),
('RES-2023-002', 'Skyline Apartments Ltd', 'Residential', 52000.00, 48000.00, 49500.00, '2024-09-30', NULL, 0, 'Active', 32),
('RES-2023-003', 'Urban Living Pvt Ltd', 'Residential', 45000.00, 41000.00, 42000.00, '2024-07-31', NULL, 0, 'Active', 28),
('RES-2023-004', 'Luxury Villas Corp', 'Residential', 68000.00, 63000.00, 75000.00, '2024-03-31', '2024-09-20', 173, 'Active', 83),
('RES-2023-005', 'Metro Residences Ltd', 'Residential', 42000.00, 38000.00, 39000.00, '2024-10-31', NULL, 0, 'Active', 26),
('RES-2023-006', 'Garden City Builders', 'Residential', 55000.00, 51000.00, 52500.00, '2024-12-15', NULL, 0, 'Active', 24),
('RES-2023-007', 'Smart Homes Pvt', 'Residential', 36000.00, 32000.00, 39500.00, '2024-04-30', '2024-10-25', 178, 'Active', 79),
('RES-2023-008', 'Downtown Towers Ltd', 'Residential', 72000.00, 68000.00, 70000.00, '2025-01-31', NULL, 0, 'Active', 22),
('RES-2024-009', 'Suburban Homes Corp', 'Residential', 41000.00, 37000.00, 45000.00, '2024-05-31', '2024-11-10', 163, 'Active', 72),
('RES-2024-010', 'Green Living Developers', 'Residential', 48000.00, 44000.00, 45500.00, '2024-08-31', NULL, 0, 'Active', 29),
('RES-2024-011', 'Waterfront Residences', 'Residential', 82000.00, 78000.00, 80000.00, '2024-11-30', NULL, 0, 'Active', 25),
('RES-2024-012', 'Hill View Apartments', 'Residential', 39000.00, 35000.00, 43000.00, '2024-06-30', '2024-12-15', 168, 'Active', 74),
('RES-2024-013', 'Eco Homes Pvt Ltd', 'Residential', 46000.00, 42000.00, 43000.00, '2024-09-15', NULL, 0, 'Active', 27),
('RES-2024-014', 'Heritage Residences', 'Residential', 58000.00, 54000.00, 64000.00, '2024-04-15', '2024-10-30', 198, 'Active', 81),
('RES-2024-015', 'Lakeside Villas Ltd', 'Residential', 61000.00, 57000.00, 59000.00, '2024-10-15', NULL, 0, 'Active', 30),
('RES-2024-016', 'City Centre Towers', 'Residential', 75000.00, 71000.00, 73000.00, '2024-12-31', NULL, 0, 'Active', 23),
('RES-2024-017', 'Riverside Apartments', 'Residential', 44000.00, 40000.00, 48500.00, '2024-07-15', '2025-01-05', 174, 'Active', 77),
('RES-2024-018', 'Valley View Homes', 'Residential', 37000.00, 33000.00, 34000.00, '2024-11-15', NULL, 0, 'Active', 21),
('RES-2024-019', 'Sunset Residences Ltd', 'Residential', 50000.00, 46000.00, 47500.00, '2025-02-28', NULL, 0, 'Active', 20),
('RES-2024-020', 'Plaza Apartments Corp', 'Residential', 53000.00, 49000.00, 58000.00, '2024-05-15', '2024-11-25', 194, 'Active', 75);

-- Insert projects (CRE - 15 projects)
INSERT INTO projects (loan_id, borrower_name, sector, sanction_amount, disbursed_amount, actual_cost, dcco_planned, dcco_actual, dcco_status, status, risk_score) VALUES
('CRE-2023-001', 'Tech Park Developers', 'CRE', 95000.00, 89000.00, 105000.00, '2024-01-31', '2024-08-10', 192, 'Active', 100),
('CRE-2023-002', 'Shopping Mall Corp', 'CRE', 78000.00, 73000.00, 75000.00, '2024-10-31', NULL, 0, 'Active', 31),
('CRE-2023-003', 'Office Complex Ltd', 'CRE', 68000.00, 64000.00, 75000.00, '2024-03-15', '2024-09-05', 174, 'Active', 88),
('CRE-2023-004', 'Business Park Pvt', 'CRE', 82000.00, 78000.00, 80000.00, '2024-09-30', NULL, 0, 'Active', 29),
('CRE-2023-005', 'Retail Plaza Builders', 'CRE', 56000.00, 52000.00, 61500.00, '2024-04-30', '2024-11-20', 204, 'Active', 90),
('CRE-2024-006', 'Corporate Tower Ltd', 'CRE', 118000.00, 112000.00, 115000.00, '2024-12-31', NULL, 0, 'Active', 27),
('CRE-2024-007', 'Warehouse Hub Corp', 'CRE', 48000.00, 44000.00, 52500.00, '2024-05-31', '2024-12-10', 193, 'Active', 85),
('CRE-2024-008', 'Logistics Park Pvt', 'CRE', 72000.00, 68000.00, 70000.00, '2024-11-15', NULL, 0, 'Active', 26),
('CRE-2024-009', 'IT Campus Developers', 'CRE', 88000.00, 83000.00, 97000.00, '2024-02-28', '2024-08-25', 179, 'Active', 92),
('CRE-2024-010', 'Convention Centre Ltd', 'CRE', 65000.00, 61000.00, 63000.00, '2024-08-31', NULL, 0, 'Active', 28),
('CRE-2024-011', 'Mega Mall Consortium', 'CRE', 125000.00, 119000.00, 122000.00, '2025-01-31', NULL, 0, 'Active', 24),
('CRE-2024-012', 'Industrial Park Corp', 'CRE', 58000.00, 54000.00, 64000.00, '2024-06-30', '2025-01-15', 199, 'Active', 86),
('CRE-2024-013', 'Commercial Hub Ltd', 'CRE', 74000.00, 70000.00, 72000.00, '2024-10-15', NULL, 0, 'Active', 25),
('CRE-2024-014', 'Data Centre Developers', 'CRE', 92000.00, 87000.00, 101500.00, '2024-03-31', '2024-10-05', 188, 'Active', 95),
('CRE-2024-015', 'Trade Centre Pvt Ltd', 'CRE', 61000.00, 57000.00, 59000.00, '2024-09-15', NULL, 0, 'Active', 23);

-- Insert projects (Other - 5 projects)
INSERT INTO projects (loan_id, borrower_name, sector, sanction_amount, disbursed_amount, actual_cost, dcco_planned, dcco_actual, dcco_status, status, risk_score) VALUES
('OTH-2023-001', 'Smart City Infrastructure', 'Other', 115000.00, 108000.00, 126500.00, '2024-02-15', '2024-08-30', 197, 'Active', 99),
('OTH-2023-002', 'Metro Rail Project Ltd', 'Other', 285000.00, 270000.00, 278000.00, '2025-03-31', NULL, 0, 'Active', 20),
('OTH-2024-003', 'Airport Expansion Corp', 'Other', 425000.00, 405000.00, 415000.00, '2025-06-30', NULL, 0, 'Active', 18),
('OTH-2024-004', 'Seaport Development Ltd', 'Other', 325000.00, 310000.00, 357500.00, '2024-12-31', NULL, 0, 'Active', 42),
('OTH-2024-005', 'Railway Station Modernization', 'Other', 185000.00, 175000.00, 180000.00, '2025-02-28', NULL, 0, 'Active', 22);

-- Insert alerts for high-risk projects
INSERT INTO alerts (project_id, alert_type, severity, status, description, resolution_plan, created_at, acknowledged_at, acknowledged_note) 
SELECT 
  p.id,
  'DCCO Deferment',
  'Critical',
  CASE WHEN random() < 0.3 THEN 'Acknowledged' WHEN random() < 0.5 THEN 'Open' ELSE 'Open' END,
  'DCCO deferred ' || p.dcco_status || ' days (breach threshold: 90 days)',
  CASE WHEN p.dcco_status > 150 THEN 'Sponsor committed additional equity infusion; revised DCCO to be finalized' ELSE 'Under review with project management team' END,
  NOW() - (random() * interval '30 days'),
  CASE WHEN random() < 0.3 THEN NOW() - (random() * interval '15 days') ELSE NULL END,
  CASE WHEN random() < 0.3 THEN 'Reviewed with management. Action plan in progress.' ELSE NULL END
FROM projects p
WHERE p.dcco_status > 90;

INSERT INTO alerts (project_id, alert_type, severity, status, description, resolution_plan, created_at)
SELECT 
  p.id,
  'Cost Overrun',
  CASE WHEN ((p.actual_cost - p.sanction_amount) / p.sanction_amount * 100) > 15 THEN 'Critical' ELSE 'High' END,
  'Open',
  'Cost overrun ' || ROUND(((p.actual_cost - p.sanction_amount) / p.sanction_amount * 100)::numeric, 2) || '% (breach threshold: 10%)',
  'Approved Standby Credit Facility being arranged',
  NOW() - (random() * interval '20 days')
FROM projects p
WHERE p.actual_cost > p.sanction_amount * 1.1;

INSERT INTO alerts (project_id, alert_type, severity, status, description, created_at)
SELECT 
  p.id,
  'Milestone Delay',
  'Medium',
  'Open',
  'Foundation milestone delayed by 60+ days',
  NOW() - (random() * interval '25 days')
FROM projects p
WHERE p.risk_score > 70 AND random() < 0.5;

-- Insert milestones for all projects
INSERT INTO milestones (project_id, name, planned_date, actual_date, status, delay_days)
SELECT 
  id,
  'Foundation',
  dcco_planned - interval '240 days',
  CASE 
    WHEN dcco_actual IS NOT NULL THEN dcco_planned - interval '180 days'
    WHEN dcco_planned < CURRENT_DATE THEN dcco_planned - interval '220 days'
    ELSE NULL
  END,
  CASE 
    WHEN dcco_actual IS NOT NULL THEN 'Completed'
    WHEN dcco_planned < CURRENT_DATE THEN 'Completed'
    ELSE 'In Progress'
  END,
  CASE 
    WHEN dcco_actual IS NOT NULL AND risk_score > 70 THEN 60
    ELSE 0
  END
FROM projects;

INSERT INTO milestones (project_id, name, planned_date, actual_date, status, delay_days)
SELECT 
  id,
  'Structural',
  dcco_planned - interval '150 days',
  CASE 
    WHEN dcco_actual IS NOT NULL THEN dcco_planned - interval '120 days'
    WHEN dcco_planned < CURRENT_DATE THEN dcco_planned - interval '140 days'
    ELSE NULL
  END,
  CASE 
    WHEN dcco_actual IS NOT NULL THEN 'Completed'
    WHEN dcco_planned < CURRENT_DATE + interval '100 days' THEN 'In Progress'
    ELSE 'Pending'
  END,
  CASE 
    WHEN dcco_actual IS NOT NULL AND risk_score > 70 THEN 30
    ELSE 0
  END
FROM projects;

INSERT INTO milestones (project_id, name, planned_date, actual_date, status, delay_days)
SELECT 
  id,
  'MEP (Mechanical, Electrical, Plumbing)',
  dcco_planned - interval '60 days',
  CASE 
    WHEN dcco_actual IS NOT NULL THEN dcco_actual - interval '30 days'
    ELSE NULL
  END,
  CASE 
    WHEN dcco_actual IS NOT NULL THEN 'Completed'
    WHEN dcco_planned < CURRENT_DATE + interval '30 days' THEN 'In Progress'
    ELSE 'Pending'
  END,
  0
FROM projects;

INSERT INTO milestones (project_id, name, planned_date, actual_date, status, delay_days)
SELECT 
  id,
  'Finishing & Handover',
  dcco_planned,
  dcco_actual,
  CASE 
    WHEN dcco_actual IS NOT NULL THEN 'Completed'
    WHEN dcco_planned < CURRENT_DATE THEN 'Delayed'
    WHEN dcco_planned < CURRENT_DATE + interval '90 days' THEN 'In Progress'
    ELSE 'Pending'
  END,
  COALESCE(dcco_status, 0)
FROM projects;

-- Insert financials for all projects
INSERT INTO financials (project_id, sanction_amount, actual_cost, burn_rate, cash_buffer_months, provision_required)
SELECT 
  p.id,
  p.sanction_amount,
  COALESCE(p.actual_cost, p.disbursed_amount),
  ROUND((p.disbursed_amount / 12)::numeric, 2), -- Simplified burn rate
  CASE 
    WHEN p.disbursed_amount > 0 THEN ROUND(((p.sanction_amount - p.disbursed_amount) / (p.disbursed_amount / 12))::numeric, 0)
    ELSE 12
  END,
  CASE 
    WHEN p.sector IN ('Highway', 'Power', 'Other') THEN 
      ROUND((p.sanction_amount * 0.01 + 
             (CASE WHEN p.dcco_status > 0 THEN p.sanction_amount * 0.00375 * (p.dcco_status / 90) ELSE 0 END))::numeric, 2)
    WHEN p.sector IN ('Residential', 'CRE') THEN 
      ROUND((p.sanction_amount * 0.0125 + 
             (CASE WHEN p.dcco_status > 0 THEN p.sanction_amount * 0.00375 * (p.dcco_status / 90) ELSE 0 END))::numeric, 2)
    ELSE 0
  END
FROM projects p;

-- Insert sample documents
INSERT INTO documents (project_id, file_name, file_size, document_type, uploaded_at)
SELECT 
  id,
  'Cost Certification Q' || FLOOR(random() * 4 + 1) || '-2024.pdf',
  2300000 + FLOOR(random() * 1000000),
  'Cost Certification',
  NOW() - (random() * interval '60 days')
FROM projects
WHERE random() < 0.8;

INSERT INTO documents (project_id, file_name, file_size, document_type, uploaded_at)
SELECT 
  id,
  'Engineer Progress Report ' || TO_CHAR(NOW() - (random() * interval '90 days'), 'Mon-YYYY') || '.pdf',
  1800000 + FLOOR(random() * 500000),
  'Progress Report',
  NOW() - (random() * interval '45 days')
FROM projects
WHERE random() < 0.9;

INSERT INTO documents (project_id, file_name, file_size, document_type, uploaded_at)
SELECT 
  id,
  'Site Photos ' || TO_CHAR(NOW() - (random() * interval '60 days'), 'YYYY-MM-DD') || '.zip',
  15000000 + FLOOR(random() * 5000000),
  'Site Photos',
  NOW() - (random() * interval '30 days')
FROM projects
WHERE random() < 0.6;

-- Insert audit log entries (sample recent activity)
INSERT INTO audit_logs (user_email, action, project_id, project_loan_id, entity_type, entity_id, field_changed, old_value, new_value, ip_address, timestamp)
SELECT 
  'demo.user@bank.com',
  'Acknowledged Alert',
  p.id,
  p.loan_id,
  'alert',
  a.id,
  'Alert Status',
  'OPEN',
  'ACKNOWLEDGED',
  '203.192.' || FLOOR(random() * 255) || '.' || FLOOR(random() * 255),
  NOW() - (random() * interval '15 days')
FROM projects p
JOIN alerts a ON a.project_id = p.id
WHERE a.acknowledged_at IS NOT NULL
LIMIT 20;

INSERT INTO audit_logs (user_email, action, project_id, project_loan_id, entity_type, field_changed, old_value, new_value, ip_address, timestamp)
SELECT 
  'demo.user@bank.com',
  'Updated Project',
  id,
  loan_id,
  'project',
  'Actual Cost',
  (actual_cost - 500)::text,
  actual_cost::text,
  '203.192.' || FLOOR(random() * 255) || '.' || FLOOR(random() * 255),
  NOW() - (random() * interval '10 days')
FROM projects
WHERE risk_score > 70
LIMIT 15;

INSERT INTO audit_logs (user_email, action, entity_type, ip_address, timestamp)
VALUES 
  ('demo.user@bank.com', 'Generated CRILC Report', 'report', '203.192.10.25', NOW() - interval '3 days'),
  ('demo.user@bank.com', 'Generated CRILC Report', 'report', '203.192.10.25', NOW() - interval '10 days'),
  ('demo.user@bank.com', 'Exported Provision Calculator', 'export', '203.192.10.25', NOW() - interval '5 days'),
  ('demo.user@bank.com', 'Generated CRILC Report', 'report', '203.192.10.25', NOW() - interval '17 days'),
  ('demo.user@bank.com', 'Viewed Audit Trail', 'audit_log', '203.192.10.25', NOW() - interval '2 days');

