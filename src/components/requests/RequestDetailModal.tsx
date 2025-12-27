import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tables } from '@/integrations/supabase/types';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  MapPin,
  Wrench,
  Tag,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  UserCheck,
  Loader2
} from 'lucide-react';

type Request = Tables<'v_requests'>;

interface RequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: Request | null;
  onStageChange?: (requestId: string, newStage: string) => void;
}

const stageConfig = {
  new: { label: 'New', color: 'bg-blue-500', next: 'in_progress' as const },
  in_progress: { label: 'In Progress', color: 'bg-amber-500', next: 'repaired' as const },
  repaired: { label: 'Repaired', color: 'bg-green-500', next: null },
  scrap: { label: 'Scrap', color: 'bg-slate-500', next: null },
};

const priorityStyles = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export function RequestDetailModal({ open, onOpenChange, request, onStageChange }: RequestDetailModalProps) {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!request) return null;

  const currentStage = stageConfig[request.stage as keyof typeof stageConfig] || stageConfig.new;

  const initials = request.technician_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleStageTransition = async (newStage: string) => {
    setUpdating(true);
    await onStageChange?.(request.id!, newStage);
    setUpdating(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return format(parseISO(dateStr), 'MMM d, yyyy');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{request.request_number}</span>
            {request.is_overdue && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl font-bold">{request.subject}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-6 flex-1 overflow-hidden">
          {/* Left Side - Details (60%) */}
          <div className="col-span-3 space-y-6 overflow-y-auto pr-2">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  Equipment
                </div>
                <p className="font-medium text-foreground">{request.equipment_name}</p>
                {request.equipment_serial && (
                  <p className="text-xs text-muted-foreground font-mono">{request.equipment_serial}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="font-medium text-foreground">{request.equipment_location || '—'}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  Type
                </div>
                <Badge variant="outline" className="capitalize">
                  {request.request_type === 'corrective' ? '🔧 Corrective' : '📅 Preventive'}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Priority
                </div>
                <Badge className={cn('capitalize', priorityStyles[request.priority as keyof typeof priorityStyles])}>
                  {request.priority}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </div>
                <p className={cn(
                  'font-medium',
                  request.is_overdue ? 'text-destructive' : 'text-foreground'
                )}>
                  {formatDate(request.due_date)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created
                </div>
                <p className="font-medium text-foreground">{formatDate(request.created_at)}</p>
              </div>
            </div>

            <Separator />

            {/* Category & Team */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Category</Label>
                <div className="flex items-center gap-2">
                  {request.category_icon && <span>{request.category_icon}</span>}
                  <span>{request.category_name || '—'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Maintenance Team</Label>
                <p>{request.team_name || '—'}</p>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Description</Label>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                {request.description || 'No description provided.'}
              </div>
            </div>

            {/* Resolution Notes */}
            {(request.stage === 'in_progress' || request.stage === 'repaired') && (
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution Notes</Label>
                <Textarea
                  id="resolution"
                  placeholder="Add notes about how the issue was resolved..."
                  className="min-h-[100px] resize-none"
                  value={resolutionNotes || request.resolution_notes || ''}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Right Side - Stage & Activity (40%) */}
          <div className="col-span-2 space-y-6 border-l border-border pl-6 overflow-y-auto">
            {/* Stage Indicator */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Stage</Label>
              <div className="flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', currentStage.color)} />
                <span className="font-medium text-foreground">{currentStage.label}</span>
              </div>

              {/* Stage Transition Buttons */}
              <div className="flex flex-wrap gap-2">
                {request.stage === 'new' && (
                  <Button
                    size="sm"
                    onClick={() => handleStageTransition('in_progress')}
                    className="gap-1"
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                    Start Work
                  </Button>
                )}
                {request.stage === 'in_progress' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStageTransition('repaired')}
                      className="gap-1 bg-green-600 hover:bg-green-700"
                      disabled={updating}
                    >
                      {updating ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                      Mark Repaired
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStageTransition('scrap')}
                      className="gap-1"
                      disabled={updating}
                    >
                      <XCircle className="h-3 w-3" />
                      Mark as Scrap
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Assigned Technician */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Assigned Technician</Label>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.technician_avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {request.technician_name || 'Unassigned'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Duration (if completed) */}
            {request.duration_hours && (
              <>
                <div className="space-y-3">
                  <Label className="text-muted-foreground">Repair Duration</Label>
                  <p className="font-medium text-foreground">{request.duration_hours} hours</p>
                </div>
                <Separator />
              </>
            )}

            {/* Timeline Info */}
            <div className="space-y-3">
              <Label className="text-muted-foreground">Timeline</Label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{request.created_at && formatDistanceToNow(parseISO(request.created_at), { addSuffix: true })}</span>
                </div>
                {request.started_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started</span>
                    <span>{formatDistanceToNow(parseISO(request.started_at), { addSuffix: true })}</span>
                  </div>
                )}
                {request.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span>{formatDistanceToNow(parseISO(request.completed_at), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
