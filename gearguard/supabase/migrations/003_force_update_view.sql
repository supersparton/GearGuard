-- 1. DROP the existing view completely. 
-- This is required because we are changing the columns and Postgres won't allow a simple replace if types/order change.
DROP VIEW IF EXISTS public.v_requests;

-- 2. Re-create the view with ALL columns including the new work_center_id and work_center_name
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
  r.work_center_id, -- NEW COLUMN
  wc.name as work_center_name, -- NEW COLUMN
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
  left join work_centers wc on r.work_center_id = wc.id -- New JOIN
  left join categories c on r.category_id = c.id
  left join maintenance_teams t on r.maintenance_team_id = t.id
  left join profiles tech on r.assigned_technician_id = tech.id
  left join profiles creator on r.created_by = creator.id;
