import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useCalendarEvents } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { RequestFormModal } from '@/components/requests/RequestFormModal';
import { Tables } from '@/integrations/supabase/types';
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

type CalendarEvent = Tables<'v_calendar'>;

function EventBar({ event }: { event: CalendarEvent }) {
  const colorClasses = {
    preventive: 'bg-green-500 text-white',
    corrective: {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-blue-500 text-white',
      low: 'bg-slate-400 text-white',
    },
  };

  const colorClass = event.request_type === 'preventive'
    ? colorClasses.preventive
    : colorClasses.corrective[event.priority as keyof typeof colorClasses.corrective] || 'bg-slate-400 text-white';

  return (
    <div
      className={cn(
        'mb-1 truncate rounded px-1.5 py-0.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity',
        colorClass,
        event.is_overdue && 'ring-2 ring-red-300'
      )}
      title={`${event.title} - ${event.equipment_name}`}
    >
      {event.title}
    </div>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: events = [], isLoading } = useCalendarEvents();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      if (!event.event_date) return false;
      return isSameDay(parseISO(event.event_date), date);
    });
  };

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date, dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 0) {
      setIsFormOpen(true);
    }
  };

  return (
    <Layout>
      <div className="flex h-full flex-col p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
            <p className="mt-1 text-muted-foreground">
              Schedule and track maintenance activities
            </p>
          </div>
          <Button className="gap-2 shadow-sm" onClick={() => setIsFormOpen(true)}>
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
              <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-7 flex-1">
              {days.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day, dayEvents)}
                    className={cn(
                      'min-h-[120px] border-b border-r border-border p-2 transition-colors cursor-pointer',
                      'hover:bg-muted/50',
                      !isCurrentMonth && 'bg-muted/30'
                    )}
                  >
                    <div className="mb-2 flex items-center justify-center">
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors',
                          isTodayDate && 'bg-primary text-primary-foreground font-semibold',
                          !isCurrentMonth && !isTodayDate && 'text-muted-foreground'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <EventBar key={event.id} event={event} />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span className="text-sm text-muted-foreground">Preventive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span className="text-sm text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
        </div>
      </div>

      <RequestFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </Layout>
  );
}
