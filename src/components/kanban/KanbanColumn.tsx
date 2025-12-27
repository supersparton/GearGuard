import { forwardRef } from 'react';
import { MaintenanceRequest } from '@/utils/mockData';
import { RequestCard } from './RequestCard';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  id: string;
  title: string;
  requests: MaintenanceRequest[];
  color: string;
  onCardClick?: (request: MaintenanceRequest) => void;
}

export const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(
  function KanbanColumn({ id, title, requests, color, onCardClick }, forwardedRef) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-lg bg-secondary/30">
      {/* Column Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div 
          className={cn(
            'h-3 w-3 rounded-full',
            color
          )} 
        />
        <h3 className="font-medium text-foreground">{title}</h3>
        <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {requests.length}
        </span>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-3 overflow-y-auto px-3 pb-3 transition-colors duration-200',
          isOver && 'bg-primary/5'
        )}
      >
        <SortableContext items={requests.map(r => r.id)} strategy={verticalListSortingStrategy}>
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => onCardClick?.(request)}
            />
          ))}
        </SortableContext>

        {requests.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border">
            <p className="text-sm text-muted-foreground">No requests</p>
          </div>
        )}
      </div>
    </div>
  );
});
