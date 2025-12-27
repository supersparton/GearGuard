-- seed.sql
-- Sample data for GearGuard

-- Insert sample equipment
INSERT INTO public.equipment (name, description, category, status, serial_number, location) VALUES
('MacBook Pro 16"', 'Apple MacBook Pro with M2 chip', 'Laptop', 'available', 'MBP-001', 'Office A'),
('Dell Monitor 27"', 'Dell UltraSharp 27 4K Monitor', 'Monitor', 'available', 'MON-001', 'Storage'),
('Sony Camera A7IV', 'Sony Alpha A7IV Mirrorless Camera', 'Camera', 'in_use', 'CAM-001', 'Studio'),
('DJI Mavic 3', 'DJI Mavic 3 Professional Drone', 'Drone', 'available', 'DRN-001', 'Storage'),
('Projector Epson', 'Epson EB-2250U Projector', 'Projector', 'maintenance', 'PRJ-001', 'IT Room');
