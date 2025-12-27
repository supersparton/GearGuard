import { mockRequests } from '@/utils/mockData';
import { formatRelativeTime, capitalizeFirst } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export function RecentRequests() {
  const recentRequests = mockRequests
    .filter((r) => r.stage !== 'repaired' && r.stage !== 'scrap')
    .slice(0, 5);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Requests</h3>
      </div>
      <div className="divide-y divide-border">
        {recentRequests.map((request) => (
          <div
            key={request.id}
            className={cn(
              'flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/30',
              request.is_overdue && 'border-l-2 border-l-destructive'
            )}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {request.request_number}
                </span>
                {request.is_overdue && (
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                )}
              </div>
              <p className="font-medium text-foreground">{request.subject}</p>
              <p className="text-sm text-muted-foreground">{request.equipment_name}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'border-0 text-xs',
                  request.priority === 'critical' && 'bg-priority-critical/10 text-priority-critical',
                  request.priority === 'high' && 'bg-priority-high/10 text-priority-high',
                  request.priority === 'medium' && 'bg-priority-medium/10 text-priority-medium',
                  request.priority === 'low' && 'bg-priority-low/10 text-priority-low'
                )}
              >
                {capitalizeFirst(request.priority)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(request.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
