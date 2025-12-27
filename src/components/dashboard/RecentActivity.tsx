import { useRecentActivity } from '@/hooks/useDashboard';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Loader2, Activity, ArrowRightLeft, UserCheck, CheckCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const actionIcons = {
  created: PlusCircle,
  stage_changed: ArrowRightLeft,
  assigned: UserCheck,
  completed: CheckCircle,
  updated: Activity,
  deleted: Activity,
};

const actionColors = {
  created: 'bg-green-100 text-green-600',
  stage_changed: 'bg-blue-100 text-blue-600',
  assigned: 'bg-purple-100 text-purple-600',
  completed: 'bg-emerald-100 text-emerald-600',
  updated: 'bg-slate-100 text-slate-600',
  deleted: 'bg-red-100 text-red-600',
};

export function RecentActivity() {
  const { data: activities = [], isLoading } = useRecentActivity(5);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => {
            const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Activity;
            const colorClass = actionColors[activity.action as keyof typeof actionColors] || 'bg-slate-100 text-slate-600';

            return (
              <div key={activity.id} className="flex items-start gap-4 px-6 py-4">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.performed_by_name || 'System'}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                  {activity.request_number && (
                    <p className="text-xs text-muted-foreground">
                      {activity.request_number} • {activity.request_subject}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.performed_at && formatDistanceToNow(parseISO(activity.performed_at), { addSuffix: true })}
                </span>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No activity yet
          </div>
        )}
      </div>
    </div>
  );
}
