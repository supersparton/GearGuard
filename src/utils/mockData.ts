// Mock data for GearGuard demo

export interface Equipment {
  id: string;
  name: string;
  serial_number: string;
  category_name: string;
  category_icon: string;
  department: string;
  location: string;
  status: 'active' | 'under_maintenance' | 'scrapped';
  open_request_count: number;
  maintenance_team_name: string;
}

export interface MaintenanceRequest {
  id: string;
  request_number: string;
  subject: string;
  description: string;
  request_type: 'corrective' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  stage: 'new' | 'in_progress' | 'repaired' | 'scrap';
  equipment_name: string;
  equipment_id: string;
  category_name: string;
  assigned_technician_name: string;
  assigned_technician_avatar?: string;
  created_at: string;
  due_date: string;
  is_overdue: boolean;
}

export interface DashboardStats {
  total_equipment: number;
  open_requests: number;
  overdue_requests: number;
  avg_repair_time_hours: number;
  requests_by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  performed_by_name: string;
  performed_at: string;
  entity_type: string;
  entity_id: string;
}

// Mock Equipment Data
export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'CNC Machine A1',
    serial_number: 'CNC-2024-001',
    category_name: 'Machinery',
    category_icon: '⚙️',
    department: 'Production',
    location: 'Building A, Floor 1',
    status: 'active',
    open_request_count: 2,
    maintenance_team_name: 'Team Alpha',
  },
  {
    id: '2',
    name: 'Hydraulic Press B2',
    serial_number: 'HP-2023-045',
    category_name: 'Machinery',
    category_icon: '⚙️',
    department: 'Production',
    location: 'Building A, Floor 2',
    status: 'under_maintenance',
    open_request_count: 1,
    maintenance_team_name: 'Team Alpha',
  },
  {
    id: '3',
    name: 'HVAC Unit C3',
    serial_number: 'HVAC-2022-112',
    category_name: 'HVAC',
    category_icon: '❄️',
    department: 'Facilities',
    location: 'Building B, Rooftop',
    status: 'active',
    open_request_count: 0,
    maintenance_team_name: 'Team Beta',
  },
  {
    id: '4',
    name: 'Forklift D4',
    serial_number: 'FL-2024-008',
    category_name: 'Vehicles',
    category_icon: '🚜',
    department: 'Warehouse',
    location: 'Warehouse A',
    status: 'active',
    open_request_count: 1,
    maintenance_team_name: 'Team Gamma',
  },
  {
    id: '5',
    name: 'Conveyor Belt E5',
    serial_number: 'CB-2021-033',
    category_name: 'Machinery',
    category_icon: '⚙️',
    department: 'Production',
    location: 'Building A, Floor 1',
    status: 'scrapped',
    open_request_count: 0,
    maintenance_team_name: 'Team Alpha',
  },
];

// Mock Maintenance Requests
export const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    request_number: 'REQ-2025-0001',
    subject: 'Oil leak detected',
    description: 'Oil leaking from the hydraulic system',
    request_type: 'corrective',
    priority: 'high',
    stage: 'new',
    equipment_name: 'CNC Machine A1',
    equipment_id: '1',
    category_name: 'Machinery',
    assigned_technician_name: 'John Smith',
    created_at: '2025-01-02T10:00:00Z',
    due_date: '2025-01-05T17:00:00Z',
    is_overdue: false,
  },
  {
    id: '2',
    request_number: 'REQ-2025-0002',
    subject: 'Scheduled maintenance',
    description: 'Monthly preventive maintenance check',
    request_type: 'preventive',
    priority: 'medium',
    stage: 'in_progress',
    equipment_name: 'Hydraulic Press B2',
    equipment_id: '2',
    category_name: 'Machinery',
    assigned_technician_name: 'Sarah Johnson',
    created_at: '2025-01-01T08:00:00Z',
    due_date: '2025-01-03T17:00:00Z',
    is_overdue: true,
  },
  {
    id: '3',
    request_number: 'REQ-2025-0003',
    subject: 'Unusual noise from motor',
    description: 'Grinding noise when operating at high speed',
    request_type: 'corrective',
    priority: 'critical',
    stage: 'new',
    equipment_name: 'CNC Machine A1',
    equipment_id: '1',
    category_name: 'Machinery',
    assigned_technician_name: 'John Smith',
    created_at: '2025-01-03T14:30:00Z',
    due_date: '2025-01-04T12:00:00Z',
    is_overdue: false,
  },
  {
    id: '4',
    request_number: 'REQ-2025-0004',
    subject: 'Battery replacement',
    description: 'Forklift battery needs replacement',
    request_type: 'corrective',
    priority: 'low',
    stage: 'repaired',
    equipment_name: 'Forklift D4',
    equipment_id: '4',
    category_name: 'Vehicles',
    assigned_technician_name: 'Mike Wilson',
    created_at: '2024-12-28T09:00:00Z',
    due_date: '2025-01-02T17:00:00Z',
    is_overdue: false,
  },
  {
    id: '5',
    request_number: 'REQ-2025-0005',
    subject: 'Filter replacement',
    description: 'Quarterly filter replacement for HVAC',
    request_type: 'preventive',
    priority: 'medium',
    stage: 'in_progress',
    equipment_name: 'HVAC Unit C3',
    equipment_id: '3',
    category_name: 'HVAC',
    assigned_technician_name: 'Emily Davis',
    created_at: '2025-01-02T11:00:00Z',
    due_date: '2025-01-06T17:00:00Z',
    is_overdue: false,
  },
  {
    id: '6',
    request_number: 'REQ-2024-0099',
    subject: 'Complete overhaul needed',
    description: 'Belt is beyond repair, marked for scrap',
    request_type: 'corrective',
    priority: 'low',
    stage: 'scrap',
    equipment_name: 'Conveyor Belt E5',
    equipment_id: '5',
    category_name: 'Machinery',
    assigned_technician_name: 'John Smith',
    created_at: '2024-12-15T10:00:00Z',
    due_date: '2024-12-20T17:00:00Z',
    is_overdue: false,
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  total_equipment: 47,
  open_requests: 12,
  overdue_requests: 3,
  avg_repair_time_hours: 4.5,
  requests_by_priority: {
    low: 4,
    medium: 5,
    high: 2,
    critical: 1,
  },
};

// Mock Activity Log
export const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    action: 'stage_changed',
    description: 'Request moved to In Progress',
    performed_by_name: 'Sarah Johnson',
    performed_at: '2025-01-03T09:15:00Z',
    entity_type: 'request',
    entity_id: '2',
  },
  {
    id: '2',
    action: 'created',
    description: 'New maintenance request created',
    performed_by_name: 'Admin User',
    performed_at: '2025-01-03T08:00:00Z',
    entity_type: 'request',
    entity_id: '3',
  },
  {
    id: '3',
    action: 'completed',
    description: 'Request marked as repaired',
    performed_by_name: 'Mike Wilson',
    performed_at: '2025-01-02T16:45:00Z',
    entity_type: 'request',
    entity_id: '4',
  },
  {
    id: '4',
    action: 'assigned',
    description: 'Assigned to Emily Davis',
    performed_by_name: 'Admin User',
    performed_at: '2025-01-02T11:30:00Z',
    entity_type: 'request',
    entity_id: '5',
  },
  {
    id: '5',
    action: 'created',
    description: 'New equipment added',
    performed_by_name: 'Admin User',
    performed_at: '2025-01-01T10:00:00Z',
    entity_type: 'equipment',
    entity_id: '4',
  },
];

// Calendar Events
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high' | 'critical';
  equipment_name: string;
}

// Helper to get dates relative to current date
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Monthly maintenance - CNC Machine A1',
    date: getRelativeDate(5),
    type: 'preventive',
    priority: 'medium',
    equipment_name: 'CNC Machine A1',
  },
  {
    id: '2',
    title: 'Quarterly inspection - HVAC Unit C3',
    date: getRelativeDate(10),
    type: 'preventive',
    priority: 'medium',
    equipment_name: 'HVAC Unit C3',
  },
  {
    id: '3',
    title: 'Oil change - Forklift D4',
    date: getRelativeDate(2),
    type: 'preventive',
    priority: 'low',
    equipment_name: 'Forklift D4',
  },
  {
    id: '4',
    title: 'Safety check - Hydraulic Press B2',
    date: getRelativeDate(-2),
    type: 'preventive',
    priority: 'high',
    equipment_name: 'Hydraulic Press B2',
  },
  {
    id: '5',
    title: 'Belt replacement - Conveyor',
    date: getRelativeDate(0),
    type: 'corrective',
    priority: 'critical',
    equipment_name: 'Conveyor Belt E5',
  },
];
