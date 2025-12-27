import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { mockDashboardStats } from '@/utils/mockData';
import { Box, ClipboardList, AlertTriangle, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back! Here's your maintenance overview.
            </p>
          </div>
          <Button onClick={() => navigate('/requests')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Equipment"
            value={mockDashboardStats.total_equipment}
            icon={Box}
            variant="primary"
          />
          <StatCard
            title="Open Requests"
            value={mockDashboardStats.open_requests}
            icon={ClipboardList}
            variant="default"
          />
          <StatCard
            title="Overdue"
            value={mockDashboardStats.overdue_requests}
            icon={AlertTriangle}
            variant={mockDashboardStats.overdue_requests > 0 ? 'danger' : 'default'}
          />
          <StatCard
            title="Avg. Repair Time"
            value={`${mockDashboardStats.avg_repair_time_hours}h`}
            icon={Clock}
            variant="success"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          <RecentRequests />
          <RecentActivity />
        </div>
      </div>
    </Layout>
  );
}
