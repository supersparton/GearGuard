import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useDashboard, useRecentRequests } from '@/hooks/useDashboard';
import { useCalendarEvents } from '@/hooks/useData';
import { Box, ClipboardList, AlertTriangle, Clock, Plus, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

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
  const { data: stats, isLoading } = useDashboard();

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back! Here's your maintenance overview.
            </p>
          </div>
          <Button onClick={() => navigate('/requests')} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Equipment"
            value={isLoading ? '—' : stats?.total_equipment ?? 0}
            icon={Box}
            variant="primary"
          />
          <StatCard
            title="Open Requests"
            value={isLoading ? '—' : stats?.open_requests ?? 0}
            icon={ClipboardList}
            variant="default"
          />
          <StatCard
            title="Overdue"
            value={isLoading ? '—' : stats?.overdue_requests ?? 0}
            icon={AlertTriangle}
            variant={(stats?.overdue_requests ?? 0) > 0 ? 'danger' : 'default'}
          />
          <StatCard
            title="Avg. Repair Time"
            value={isLoading ? '—' : `${stats?.avg_repair_hours ?? 0}h`}
            icon={Clock}
            variant="success"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <RecentRequests />
          <RecentActivity />
        </div>

        {/* Upcoming Events */}
        <UpcomingEvents />
      </div>
    </Layout>
  );
}
