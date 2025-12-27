import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { MaintenanceChart } from '@/components/dashboard/MaintenanceChart';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useDashboard, useRecentRequests } from '@/hooks/useDashboard';
import { useCalendarEvents } from '@/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { RequestFormModal } from '@/components/requests/RequestFormModal';
import { Input } from '@/components/ui/input';
import {
  Box,
  ClipboardList,
  AlertTriangle,
  Clock,
  Plus,
  Calendar,
  Loader2,
  Users,
  Wrench,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { useMemo } from 'react';

// Technician Dashboard - Kanban View (can edit status, but not create new)
function TechnicianDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { profile } = useAuth();

  return (
    <Layout>
      <div className="flex h-full flex-col p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.first_name || 'Technician'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your assigned maintenance requests
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Kanban Board - Technicians can drag/drop to change status */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    </Layout>
  );
}

function UpcomingEvents() {
  const navigate = useNavigate();
  const { data: events = [], isLoading } = useCalendarEvents();
  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcomingEvents = events
    ?.filter(event => {
      if (!event.event_date) return false;
      const eventDate = parseISO(event.event_date);
      return isAfter(eventDate, today) && isBefore(eventDate, nextWeek);
    })
    .slice(0, 4) ?? [];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Upcoming This Week</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
          View Calendar
        </Button>
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.equipment_name}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {event.event_date && format(parseISO(event.event_date), 'MMM d')}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-muted-foreground">
            No upcoming events this week
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: stats, isLoading } = useDashboard();

  // Technicians see only the Kanban board
  if (profile?.role === 'technician') {
    return <TechnicianDashboard />;
  }

  // Calculate critical equipment (for demo, equipment under maintenance or with critical requests)
  const criticalEquipmentCount = stats?.under_maintenance_equipment ?? 0;
  const criticalEquipmentPercent = stats?.total_equipment
    ? Math.round((criticalEquipmentCount / stats.total_equipment) * 100)
    : 0;

  // Calculate technician load (demo: based on in-progress vs total capacity)
  const technicianLoad = useMemo(() => {
    const inProgress = stats?.in_progress_requests ?? 0;
    const activeUsers = stats?.active_users ?? 1;
    // Assuming each technician can handle ~5 concurrent tasks
    const capacity = activeUsers * 5;
    return Math.min(100, Math.round((inProgress / capacity) * 100));
  }, [stats]);

  // Generate alerts based on data
  const alerts = useMemo(() => {
    const alertsList: Array<{
      id: string;
      type: 'critical' | 'warning' | 'info';
      title: string;
      description: string;
      action?: { label: string; href: string };
    }> = [];

    if ((stats?.critical_open ?? 0) > 0) {
      alertsList.push({
        id: 'critical-requests',
        type: 'critical',
        title: `${stats?.critical_open} Critical Request${(stats?.critical_open ?? 0) > 1 ? 's' : ''}`,
        description: 'Immediate attention required for critical priority requests',
        action: { label: 'View', href: '/requests' },
      });
    }

    if ((stats?.overdue_requests ?? 0) > 0) {
      alertsList.push({
        id: 'overdue',
        type: 'warning',
        title: `${stats?.overdue_requests} Overdue Request${(stats?.overdue_requests ?? 0) > 1 ? 's' : ''}`,
        description: 'These requests have passed their due date',
        action: { label: 'View', href: '/requests' },
      });
    }

    if ((stats?.high_open ?? 0) > 3) {
      alertsList.push({
        id: 'high-requests',
        type: 'warning',
        title: `${stats?.high_open} High Priority Requests`,
        description: 'Consider prioritizing high priority maintenance tasks',
        action: { label: 'View', href: '/requests' },
      });
    }

    if (technicianLoad > 85) {
      alertsList.push({
        id: 'technician-load',
        type: 'info',
        title: 'High Technician Utilization',
        description: `Team is at ${technicianLoad}% capacity. Consider redistributing workload.`,
      });
    }

    return alertsList;
  }, [stats, technicianLoad]);

  const chartData = {
    new: stats?.new_requests ?? 0,
    in_progress: stats?.in_progress_requests ?? 0,
    repaired: stats?.repaired_requests ?? 0,
    scrap: stats?.scrap_requests ?? 0,
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
            <p className="mt-1 text-muted-foreground">
              Real-time maintenance operations overview
            </p>
          </div>
          <Button onClick={() => navigate('/requests')} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Primary KPIs - Top Row */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Critical Equipment"
            value={criticalEquipmentCount}
            subtitle={`${criticalEquipmentPercent}% of total assets`}
            icon={AlertTriangle}
            variant={criticalEquipmentCount > 0 ? 'danger' : 'success'}
            progress={criticalEquipmentPercent}
          />
          <KPICard
            title="Technician Load"
            value={`${technicianLoad}%`}
            subtitle={`${stats?.active_users ?? 0} active technicians`}
            icon={Users}
            variant={technicianLoad > 85 ? 'warning' : technicianLoad > 60 ? 'primary' : 'success'}
            progress={technicianLoad}
          />
          <KPICard
            title="Open Requests"
            value={stats?.open_requests ?? 0}
            subtitle={`${stats?.overdue_requests ?? 0} overdue`}
            icon={ClipboardList}
            variant={(stats?.overdue_requests ?? 0) > 0 ? 'warning' : 'primary'}
          />
          <KPICard
            title="Avg. Repair Time"
            value={`${stats?.avg_repair_hours ?? 0}h`}
            subtitle="Average completion time"
            icon={Clock}
            variant="success"
          />
        </div>

        {/* Secondary Stats - Smaller cards */}
        <div className="mb-6 grid gap-4 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Box className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.total_equipment ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total Equipment</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.active_equipment ?? 0}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
                <Wrench className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.under_maintenance_equipment ?? 0}</p>
                <p className="text-xs text-muted-foreground">Maintenance</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.active_teams ?? 0}</p>
                <p className="text-xs text-muted-foreground">Teams</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Left: Chart + Alerts */}
          <div className="space-y-6">
            <MaintenanceChart data={chartData} isLoading={isLoading} />
            <AlertsPanel alerts={alerts} isLoading={isLoading} />
          </div>

          {/* Center: Recent Requests */}
          <div className="lg:col-span-1">
            <RecentRequests />
          </div>

          {/* Right: Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Upcoming Events */}
        <UpcomingEvents />
      </div>
    </Layout>
  );
}
