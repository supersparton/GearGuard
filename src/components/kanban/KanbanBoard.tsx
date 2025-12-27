import { useState } from 'react';
import { MaintenanceRequest, mockRequests } from '@/utils/mockData';
import { KanbanColumn } from './KanbanColumn';
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

const stages = [
  { id: 'new', title: 'New', color: 'bg-stage-new' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-stage-in-progress' },
  { id: 'repaired', title: 'Repaired', color: 'bg-stage-repaired' },
  { id: 'scrap', title: 'Scrap', color: 'bg-stage-scrap' },
];

export function KanbanBoard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests);
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRequest(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetStage = stages.find((s) => s.id === overId);
    if (targetStage) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === activeId ? { ...r, stage: targetStage.id as MaintenanceRequest['stage'] } : r
        )
      );
    }
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    console.log('Card clicked:', request);
    // TODO: Open request detail modal
  };

  return (
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
          />
        ))}
      </div>

      <DragOverlay>
        {activeRequest && (
          <div className="rotate-3">
            <RequestCard request={activeRequest} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
