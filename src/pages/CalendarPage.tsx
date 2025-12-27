import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockCalendarEvents, CalendarEvent } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { capitalizeFirst } from '@/utils/helpers';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from 'date-fns';

function EventBadge({ event }: { event: CalendarEvent }) {
  return (
    <div
      className={cn(
        'mb-1 truncate rounded px-1.5 py-0.5 text-xs font-medium',
        event.type === 'preventive' && 'bg-success/10 text-success',
        event.type === 'corrective' && event.priority === 'critical' && 'bg-priority-critical/10 text-priority-critical',
        event.type === 'corrective' && event.priority === 'high' && 'bg-priority-high/10 text-priority-high',
        event.type === 'corrective' && event.priority === 'medium' && 'bg-priority-medium/10 text-priority-medium',
        event.type === 'corrective' && event.priority === 'low' && 'bg-priority-low/10 text-priority-low'
      )}
    >
      {event.title}
    </div>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const getEventsForDay = (date: Date) => {
    return mockCalendarEvents.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );
  };

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <Layout>
      <div className="flex h-full flex-col p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
            <p className="mt-1 text-muted-foreground">
              Schedule and track maintenance activities
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Calendar Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="px-4 py-3 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1">
            {days.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={idx}
                  className={cn(
                    'min-h-[120px] border-b border-r border-border p-2 transition-colors hover:bg-secondary/30',
                    !isCurrentMonth && 'bg-muted/30'
                  )}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-sm',
                        isTodayDate && 'bg-primary text-primary-foreground font-medium',
                        !isCurrentMonth && 'text-muted-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <EventBadge key={event.id} event={event} />
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-success/50" />
            <span className="text-sm text-muted-foreground">Preventive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-priority-critical/50" />
            <span className="text-sm text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-priority-high/50" />
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-priority-medium/50" />
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
