import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, Eye } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

type Request = Tables<'v_requests'>;

interface RequestCardProps {
  request: Request;
  onClick?: () => void;
}

const priorityStyles = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const stageColors = {
  new: 'border-l-blue-500',
  in_progress: 'border-l-amber-500',
  repaired: 'border-l-green-500',
  scrap: 'border-l-slate-400',
};

const typeStyles = {
  corrective: 'bg-amber-50 text-amber-700',
  preventive: 'bg-emerald-50 text-emerald-700',
};

export function RequestCard({ request, onClick }: RequestCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: request.id!,
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  const initials = request.technician_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const stageColor = stageColors[request.stage as keyof typeof stageColors] || 'border-l-slate-300';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group cursor-grab rounded-xl border border-l-4 bg-card p-4 shadow-sm transition-all duration-200',
        'hover:shadow-md hover:border-primary/20',
        stageColor,
        isDragging && 'opacity-50 shadow-lg rotate-2',
        request.is_overdue && 'ring-2 ring-red-200'
      )}
    >
      {/* Header - Category Icon + Subject */}
      <div className="mb-3 flex items-start gap-2">
        {request.category_icon && (
          <span className="text-lg shrink-0">{request.category_icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground line-clamp-2">{request.subject}</p>
          <p className="mt-1 text-sm text-muted-foreground truncate">
            {request.equipment_name}
          </p>
        </div>
      </div>

      {/* Badges Row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn('text-xs font-medium', priorityStyles[request.priority as keyof typeof priorityStyles])}
        >
          {request.priority}
        </Badge>
        <Badge variant="secondary" className={cn('text-xs', typeStyles[request.request_type as keyof typeof typeStyles])}>
          {request.request_type === 'corrective' ? '🔧 Corrective' : '📅 Preventive'}
        </Badge>
      </div>

      {/* Assignee + Due */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={request.technician_avatar || undefined} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate max-w-[80px]">
            {request.technician_name || 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {request.is_overdue && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Overdue</span>
            </div>
          )}
          {!request.is_overdue && request.due_date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">
                {formatDistanceToNow(parseISO(request.due_date), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Request Number + View Details */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-mono">{request.request_number}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="flex items-center gap-1 text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="h-3 w-3" />
          View Details
        </button>
      </div>
    </div>
  );
}
