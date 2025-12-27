import { useDroppable } from '@dnd-kit/core';
import { RequestCard } from './RequestCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Request = Tables<'v_requests'>;

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  requests: Request[];
  onCardClick: (request: Request) => void;
  onAddRequest?: () => void;
}

export function KanbanColumn({ id, title, color, requests, onCardClick, onAddRequest }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full min-w-[320px] flex-col rounded-xl transition-colors duration-200',
        isOver && 'bg-primary/5'
      )}
    >
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('h-3 w-3 rounded-full', color)} />
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {requests.length}
          </span>
        </div>
        {onAddRequest && (
          <Button variant="ghost" size="sm" onClick={onAddRequest} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cards Container */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onClick={() => onCardClick(request)}
          />
        ))}

        {/* Empty State */}
        {requests.length === 0 && (
          <div className={cn(
            'flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border/50 transition-colors',
            isOver && 'border-primary/50 bg-primary/5'
          )}>
            <p className="text-sm text-muted-foreground">
              {isOver ? 'Drop here' : 'No requests'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
