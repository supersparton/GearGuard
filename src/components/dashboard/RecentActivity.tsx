import { mockActivityLog } from '@/utils/mockData';
import { formatRelativeTime, capitalizeFirst } from '@/utils/helpers';
import { Clock, ArrowRight, Plus, UserCheck, CheckCircle } from 'lucide-react';

const actionIcons = {
  created: Plus,
  stage_changed: ArrowRight,
  assigned: UserCheck,
  completed: CheckCircle,
  updated: Clock,
  deleted: Clock,
};

export function RecentActivity() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {mockActivityLog.slice(0, 5).map((activity) => {
          const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Clock;
          return (
            <div key={activity.id} className="flex items-start gap-4 px-6 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.performed_by_name}</span>
                  {' · '}
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {capitalizeFirst(activity.entity_type)} · {formatRelativeTime(activity.performed_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
