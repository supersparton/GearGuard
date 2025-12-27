import { MaintenanceRequest } from '@/utils/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { capitalizeFirst, formatDate } from '@/utils/helpers';
import { AlertCircle, Calendar, User } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RequestCardProps {
  request: MaintenanceRequest;
  onClick?: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'cursor-grab rounded-lg border bg-card p-4 transition-all duration-200',
        'hover:shadow-md active:cursor-grabbing',
        isDragging && 'rotate-2 shadow-lg opacity-90',
        request.is_overdue ? 'border-l-4 border-l-destructive border-t-border border-r-border border-b-border' : 'border-border'
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {request.request_number}
          </span>
          {request.is_overdue && (
            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          )}
        </div>
        <Badge
          variant="outline"
          className={cn(
            'border-0 text-xs font-medium',
            request.priority === 'critical' && 'bg-priority-critical/10 text-priority-critical',
            request.priority === 'high' && 'bg-priority-high/10 text-priority-high',
            request.priority === 'medium' && 'bg-priority-medium/10 text-priority-medium',
            request.priority === 'low' && 'bg-priority-low/10 text-priority-low'
          )}
        >
          {capitalizeFirst(request.priority)}
        </Badge>
      </div>

      {/* Content */}
      <h4 className="mb-2 font-medium text-foreground leading-snug">
        {request.subject}
      </h4>
      <p className="mb-3 text-sm text-muted-foreground">
        {request.equipment_name}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(request.due_date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {request.assigned_technician_name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </div>
  );
}
