-- 1. Add work_center_id column to maintenance_requests table
ALTER TABLE maintenance_requests 
ADD COLUMN IF NOT EXISTS work_center_id UUID REFERENCES work_centers(id);

-- 2. Make equipment_id nullable (to allow requests linked only to a Work Center)
ALTER TABLE maintenance_requests 
ALTER COLUMN equipment_id DROP NOT NULL;

-- 3. DROP existing view first to avoid "cannot change name of view column" errors
DROP VIEW IF EXISTS public.v_requests;

-- 4. Re-create v_requests view with new fields
CREATE OR REPLACE VIEW public.v_requests AS
SELECT
  r.id,
  r.request_number,
  r.subject,
  r.description,
  r.resolution_notes,
  r.request_type,
  r.priority,
  r.stage,
  r.scheduled_date,
  r.due_date,
  r.started_at,
  r.completed_at,
  r.duration_hours,
  r.created_at,
  r.updated_at,
  r.equipment_id,
  e.name as equipment_name,
  e.serial_number as equipment_serial,
  e.location as equipment_location,
  e.status as equipment_status,
  r.work_center_id, -- New field
  wc.name as work_center_name, -- New field
  r.category_id,
  c.name as category_name,
  c.icon as category_icon,
  c.color as category_color,
  r.maintenance_team_id,
  t.name as team_name,
  r.assigned_technician_id,
  (tech.first_name || ' '::text) || tech.last_name as technician_name,
  tech.avatar_url as technician_avatar,
  r.created_by,
  (creator.first_name || ' '::text) || creator.last_name as created_by_name,
  case
    when (
      r.stage = any (
        array[
          'new'::request_stage,
          'in_progress'::request_stage
        ]
      )
    )
    and r.due_date is not null
    and r.due_date < CURRENT_DATE then true
    else false
  end as is_overdue,
  case
    when r.due_date is not null then r.due_date - CURRENT_DATE
    else null::integer
  end as days_until_due
FROM
  maintenance_requests r
  left join equipment e on r.equipment_id = e.id
  left join work_centers wc on r.work_center_id = wc.id -- New join
  left join categories c on r.category_id = c.id
  left join maintenance_teams t on r.maintenance_team_id = t.id
  left join profiles tech on r.assigned_technician_id = tech.id
  left join profiles creator on r.created_by = creator.id;
