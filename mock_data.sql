-- GearGuard Mock Data Script
-- Run this in Supabase SQL Editor
-- WARNING: This will DELETE all existing data (except profiles)

-- ================================================
-- STEP 1: DELETE EXISTING DATA (ORDER MATTERS!)
-- ================================================

-- Delete in reverse dependency order
DELETE FROM notifications;
DELETE FROM activity_log;
DELETE FROM maintenance_requests;
DELETE FROM team_members;
DELETE FROM equipment;
DELETE FROM maintenance_teams;
DELETE FROM categories;
DELETE FROM work_centers;

-- ================================================
-- STEP 2: INSERT CATEGORIES
-- ================================================

INSERT INTO categories (id, name, description, icon, color, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Computers', 'Laptops, desktops, and workstations', '💻', '#3B82F6', 1),
  ('22222222-2222-2222-2222-222222222222', 'Monitors', 'Display screens and monitors', '🖥️', '#10B981', 2),
  ('33333333-3333-3333-3333-333333333333', 'Printers', 'Printers, scanners, and copiers', '🖨️', '#8B5CF6', 3),
  ('44444444-4444-4444-4444-444444444444', 'Machinery', 'Industrial machinery and equipment', '⚙️', '#F59E0B', 4),
  ('55555555-5555-5555-5555-555555555555', 'HVAC', 'Heating, ventilation, and AC systems', '❄️', '#06B6D4', 5),
  ('66666666-6666-6666-6666-666666666666', 'Vehicles', 'Company vehicles and transport', '🚗', '#EF4444', 6);

-- ================================================
-- STEP 3: INSERT WORK CENTERS
-- ================================================

INSERT INTO work_centers (id, name, code, tag, cost_per_hour, capacity_efficiency, oee_target) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Assembly Line 1', 'ASM-01', 'Production', 150.00, 95.00, 85.00),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Assembly Line 2', 'ASM-02', 'Production', 145.00, 92.00, 85.00),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'CNC Machining', 'CNC-01', 'Machining', 200.00, 88.00, 80.00),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Quality Control', 'QC-01', 'Inspection', 80.00, 98.00, 95.00),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Packaging Station', 'PKG-01', 'Finishing', 60.00, 90.00, 88.00);

-- ================================================
-- STEP 4: INSERT MAINTENANCE TEAMS
-- ================================================

INSERT INTO maintenance_teams (id, name, description) VALUES
  ('ffffffff-1111-1111-1111-ffffffffffff', 'IT Support', 'Handles all IT equipment and software issues'),
  ('ffffffff-2222-2222-2222-ffffffffffff', 'Mechanical Team', 'Industrial machinery and mechanical systems'),
  ('ffffffff-3333-3333-3333-ffffffffffff', 'Electrical Team', 'Electrical systems and power equipment'),
  ('ffffffff-4444-4444-4444-ffffffffffff', 'Facilities Team', 'Building maintenance and HVAC systems');

-- ================================================
-- STEP 5: INSERT TEAM MEMBERS (uses existing profiles)
-- ================================================

-- Note: You need at least one profile to exist
-- This inserts the current user as a team member
INSERT INTO team_members (team_id, user_id, role)
SELECT 'ffffffff-1111-1111-1111-ffffffffffff', id, 'lead'
FROM profiles LIMIT 1;

-- ================================================
-- STEP 6: INSERT EQUIPMENT
-- ================================================

INSERT INTO equipment (id, name, serial_number, description, category_id, department, location, status, maintenance_team_id, purchase_date, warranty_expiry, company_name, used_by_employee_name) VALUES
  ('eeeeeee1-1111-1111-1111-eeeeeeeeeeee', 'Dell XPS 15 Laptop', 'DELL-XPS-001', 'High-performance developer laptop', '11111111-1111-1111-1111-111111111111', 'Engineering', 'Building A, Floor 2', 'active', 'ffffffff-1111-1111-1111-ffffffffffff', '2023-01-15', '2026-01-15', 'GearGuard Inc.', 'John Developer'),
  ('eeeeeee2-2222-2222-2222-eeeeeeeeeeee', 'MacBook Pro 16"', 'APPLE-MBP-002', 'Design team workstation', '11111111-1111-1111-1111-111111111111', 'Design', 'Building A, Floor 3', 'active', 'ffffffff-1111-1111-1111-ffffffffffff', '2023-06-20', '2026-06-20', 'GearGuard Inc.', 'Jane Designer'),
  ('eeeeeee3-3333-3333-3333-eeeeeeeeeeee', 'Samsung 32" Curved Monitor', 'SAM-MON-003', 'Ultra-wide curved display', '22222222-2222-2222-2222-222222222222', 'Engineering', 'Building A, Floor 2', 'active', 'ffffffff-1111-1111-1111-ffffffffffff', '2023-03-10', '2026-03-10', 'GearGuard Inc.', 'John Developer'),
  ('eeeeeee4-4444-4444-4444-eeeeeeeeeeee', 'HP LaserJet Pro', 'HP-LJ-004', 'Network laser printer', '33333333-3333-3333-3333-333333333333', 'Admin', 'Building B, Floor 1', 'active', 'ffffffff-1111-1111-1111-ffffffffffff', '2022-08-01', '2025-08-01', 'GearGuard Inc.', NULL),
  ('eeeeeee5-5555-5555-5555-eeeeeeeeeeee', 'CNC Milling Machine', 'CNC-MILL-005', 'Precision 5-axis milling machine', '44444444-4444-4444-4444-444444444444', 'Production', 'Factory Floor', 'active', 'ffffffff-2222-2222-2222-ffffffffffff', '2021-11-15', '2026-11-15', 'GearGuard Inc.', 'Mike Operator'),
  ('eeeeeee6-6666-6666-6666-eeeeeeeeeeee', 'Industrial Lathe', 'LATHE-006', 'Heavy-duty turning lathe', '44444444-4444-4444-4444-444444444444', 'Production', 'Factory Floor', 'under_maintenance', 'ffffffff-2222-2222-2222-ffffffffffff', '2020-05-20', '2025-05-20', 'GearGuard Inc.', 'Tom Turner'),
  ('eeeeeee7-7777-7777-7777-eeeeeeeeeeee', 'Central AC Unit', 'HVAC-AC-007', 'Main building air conditioning', '55555555-5555-5555-5555-555555555555', 'Facilities', 'Building A, Roof', 'active', 'ffffffff-4444-4444-4444-ffffffffffff', '2019-09-01', '2024-09-01', 'GearGuard Inc.', NULL),
  ('eeeeeee8-8888-8888-8888-eeeeeeeeeeee', 'Forklift #1', 'FORK-001-008', 'Electric warehouse forklift', '66666666-6666-6666-6666-666666666666', 'Warehouse', 'Warehouse A', 'active', 'ffffffff-2222-2222-2222-ffffffffffff', '2022-02-15', '2027-02-15', 'GearGuard Inc.', 'Sam Warehouse');

-- ================================================
-- STEP 7: INSERT MAINTENANCE REQUESTS
-- ================================================

INSERT INTO maintenance_requests (id, request_number, subject, description, request_type, priority, stage, equipment_id, category_id, maintenance_team_id, created_by, scheduled_date, due_date, target_type)
SELECT 
  'rrrrrrr1-1111-1111-1111-rrrrrrrrrrrr',
  'MR-2024-001',
  'Laptop screen flickering',
  'The screen flickers intermittently during use. May need display cable replacement.',
  'corrective',
  'high',
  'new',
  'eeeeeee1-1111-1111-1111-eeeeeeeeeeee',
  '11111111-1111-1111-1111-111111111111',
  'ffffffff-1111-1111-1111-ffffffffffff',
  p.id,
  NULL,
  CURRENT_DATE + INTERVAL '3 days',
  'equipment'
FROM profiles p LIMIT 1;

INSERT INTO maintenance_requests (id, request_number, subject, description, request_type, priority, stage, equipment_id, category_id, maintenance_team_id, created_by, scheduled_date, due_date, target_type)
SELECT 
  'rrrrrrr2-2222-2222-2222-rrrrrrrrrrrr',
  'MR-2024-002',
  'Printer paper jam issue',
  'Frequent paper jams occurring in the main tray. Rollers may need cleaning or replacement.',
  'corrective',
  'medium',
  'in_progress',
  'eeeeeee4-4444-4444-4444-eeeeeeeeeeee',
  '33333333-3333-3333-3333-333333333333',
  'ffffffff-1111-1111-1111-ffffffffffff',
  p.id,
  NULL,
  CURRENT_DATE + INTERVAL '5 days',
  'equipment'
FROM profiles p LIMIT 1;

INSERT INTO maintenance_requests (id, request_number, subject, description, request_type, priority, stage, equipment_id, category_id, maintenance_team_id, created_by, scheduled_date, due_date, target_type)
SELECT 
  'rrrrrrr3-3333-3333-3333-rrrrrrrrrrrr',
  'MR-2024-003',
  'Quarterly CNC calibration',
  'Scheduled quarterly calibration and maintenance for CNC machine.',
  'preventive',
  'medium',
  'new',
  'eeeeeee5-5555-5555-5555-eeeeeeeeeeee',
  '44444444-4444-4444-4444-444444444444',
  'ffffffff-2222-2222-2222-ffffffffffff',
  p.id,
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '10 days',
  'equipment'
FROM profiles p LIMIT 1;

INSERT INTO maintenance_requests (id, request_number, subject, description, request_type, priority, stage, equipment_id, category_id, maintenance_team_id, created_by, scheduled_date, due_date, target_type)
SELECT 
  'rrrrrrr4-4444-4444-4444-rrrrrrrrrrrr',
  'MR-2024-004',
  'Lathe bearing replacement',
  'Bearings showing signs of wear. Scheduled for replacement before failure.',
  'preventive',
  'high',
  'in_progress',
  'eeeeeee6-6666-6666-6666-eeeeeeeeeeee',
  '44444444-4444-4444-4444-444444444444',
  'ffffffff-2222-2222-2222-ffffffffffff',
  p.id,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '2 days',
  'equipment'
FROM profiles p LIMIT 1;

INSERT INTO maintenance_requests (id, request_number, subject, description, request_type, priority, stage, equipment_id, category_id, maintenance_team_id, created_by, scheduled_date, due_date, target_type)
SELECT 
  'rrrrrrr5-5555-5555-5555-rrrrrrrrrrrr',
  'MR-2024-005',
  'AC filter replacement',
  'Annual HVAC filter replacement and system check.',
  'preventive',
  'low',
  'repaired',
  'eeeeeee7-7777-7777-7777-eeeeeeeeeeee',
  '55555555-5555-5555-5555-555555555555',
  'ffffffff-4444-4444-4444-ffffffffffff',
  p.id,
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE - INTERVAL '3 days',
  'equipment'
FROM profiles p LIMIT 1;

INSERT INTO maintenance_requests (id, request_number, subject, description, request_type, priority, stage, equipment_id, category_id, maintenance_team_id, created_by, scheduled_date, due_date, target_type)
SELECT 
  'rrrrrrr6-6666-6666-6666-rrrrrrrrrrrr',
  'MR-2024-006',
  'Monitor no display',
  'Monitor not showing any display. Power light is on but no signal detected.',
  'corrective',
  'critical',
  'new',
  'eeeeeee3-3333-3333-3333-eeeeeeeeeeee',
  '22222222-2222-2222-2222-222222222222',
  'ffffffff-1111-1111-1111-ffffffffffff',
  p.id,
  NULL,
  CURRENT_DATE,
  'equipment'
FROM profiles p LIMIT 1;

-- ================================================
-- STEP 8: INSERT NOTIFICATIONS
-- ================================================

INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  p.id,
  'New Assignment',
  'You have been assigned to: Laptop screen flickering',
  'assignment',
  false
FROM profiles p LIMIT 1;

INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  p.id,
  'Request Updated',
  'Request MR-2024-005 has been marked as repaired',
  'update',
  true
FROM profiles p LIMIT 1;

INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  p.id,
  'Overdue Alert',
  'Request MR-2024-006 is overdue! Please prioritize.',
  'overdue',
  false
FROM profiles p LIMIT 1;

-- ================================================
-- DONE! Summary of inserted data:
-- ================================================
-- Categories: 6
-- Work Centers: 5
-- Maintenance Teams: 4
-- Equipment: 8
-- Maintenance Requests: 6 (various stages)
-- Notifications: 3
-- ================================================

SELECT 'Mock data inserted successfully!' AS result;
