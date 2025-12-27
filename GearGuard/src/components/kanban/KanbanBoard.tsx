import { useState } from 'react';
import { useRequests, useUpdateRequestStage } from '@/hooks/useRequests';
import { useAuth } from '@/contexts/AuthContext';
import { KanbanColumn } from './KanbanColumn';
import { RequestFormModal } from '@/components/requests/RequestFormModal';
import { RequestDetailModal } from '@/components/requests/RequestDetailModal';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { RequestCard } from './RequestCard';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Request = Tables<'v_requests'>;

const stages = [
  { id: 'new', title: 'New', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500' },
  { id: 'repaired', title: 'Repaired', color: 'bg-green-500' },
  { id: 'scrap', title: 'Scrap', color: 'bg-slate-500' },
];

export function KanbanBoard() {
  const { profile } = useAuth();
  const { data: requests = [], isLoading } = useRequests();
  const updateStage = useUpdateRequestStage();
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isTechnician = profile?.role === 'technician';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getRequestsByStage = (stage: string) => {
    return requests.filter((r) => r.stage === stage);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const request = requests.find((r) => r.id === event.active.id);
    if (request) {
      setActiveRequest(request);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRequest(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const targetStage = stages.find((s) => s.id === overId);
    if (targetStage) {
      const request = requests.find(r => r.id === activeId);
      if (request && request.stage !== targetStage.id) {
        try {
          await updateStage.mutateAsync({ id: activeId, stage: targetStage.id });
          toast.success(`Request moved to ${targetStage.title}`);
        } catch (error) {
          toast.error('Failed to update request');
        }
      }
    }
  };

  const handleCardClick = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleStageChange = async (requestId: string, newStage: string) => {
    try {
      await updateStage.mutateAsync({ id: requestId, stage: newStage });
      setSelectedRequest(prev => prev ? { ...prev, stage: newStage as any } : null);
      const stageLabel = stages.find(s => s.id === newStage)?.title || newStage;
      toast.success(`Request moved to ${stageLabel}`);
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.title}
              color={stage.color}
              requests={getRequestsByStage(stage.id)}
              onCardClick={handleCardClick}
              onAddRequest={!isTechnician && stage.id === 'new' ? () => setIsFormOpen(true) : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeRequest && (
            <div className="rotate-2 scale-105">
              <RequestCard request={activeRequest} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <RequestFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <RequestDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedRequest}
        onStageChange={handleStageChange}
      />
    </>
  );
}
