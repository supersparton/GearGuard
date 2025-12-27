import { useRecentRequests } from '@/hooks/useDashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const priorityColors = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const stageColors = {
  new: 'bg-blue-500',
  in_progress: 'bg-amber-500',
  repaired: 'bg-green-500',
  scrap: 'bg-slate-500',
};

export function RecentRequests() {
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useRecentRequests(5);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Recent Requests</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/requests')} className="gap-1">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50 cursor-pointer"
              onClick={() => navigate('/requests')}
            >
              <div className={cn('h-2 w-2 rounded-full', stageColors[request.stage as keyof typeof stageColors])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{request.subject}</p>
                  {request.is_overdue && (
                    <Badge variant="destructive" className="text-xs">Overdue</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {request.equipment_name} • {request.request_number}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={cn('text-xs', priorityColors[request.priority as keyof typeof priorityColors])}>
                  {request.priority}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {request.created_at && formatDistanceToNow(parseISO(request.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No requests yet
          </div>
        )}
      </div>
    </div>
  );
}
