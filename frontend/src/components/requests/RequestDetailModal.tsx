import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText,
  BookOpen,
  Paperclip,
  Loader2,
  Users,
  Clock
} from 'lucide-react';

type Request = Tables<'v_requests'>;

interface RequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: Request | null;
  onStageChange?: (requestId: string, newStage: string) => void;
}

const stageConfig = {
  new: { label: 'New', color: 'bg-stage-new', textColor: 'text-primary', next: 'in_progress' as const },
  in_progress: { label: 'In Progress', color: 'bg-stage-in-progress', textColor: 'text-warning', next: 'repaired' as const },
  repaired: { label: 'Repaired', color: 'bg-stage-repaired', textColor: 'text-success', next: null },
  scrap: { label: 'Scrap', color: 'bg-stage-scrap', textColor: 'text-muted-foreground', next: null },
};

const priorityStyles = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
};

export function RequestDetailModal({ open, onOpenChange, request, onStageChange }: RequestDetailModalProps) {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header with Status Bar */}
        <div className="flex-shrink-0 border-b border-border">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground font-mono">{request.request_number}</span>
                {request.is_overdue && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Overdue
                  </Badge>
                )}
              </div>
              <Badge className={cn('capitalize', priorityStyles[request.priority as keyof typeof priorityStyles])}>
                {request.priority} priority
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold mt-2">{request.subject}</DialogTitle>
          </DialogHeader>

          {/* Stage Progress Bar */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2">
              {Object.entries(stageConfig).map(([key, config], index, arr) => {
                const isActive = request.stage === key;
                const isPast = Object.keys(stageConfig).indexOf(request.stage as string) > index;
                
                return (
                  <div key={key} className="flex items-center flex-1">
                    <div className={cn(
                      'flex-1 h-2 rounded-full transition-colors',
                      isActive || isPast ? config.color : 'bg-muted'
                    )} />
                    {index < arr.length - 1 && <div className="w-1" />}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {Object.entries(stageConfig).map(([key, config]) => (
                <span key={key} className={cn(
                  'text-xs font-medium',
                  request.stage === key ? config.textColor : 'text-muted-foreground'
                )}>
                  {config.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-0 flex-1 overflow-hidden">
          {/* Left Side - Details (60%) */}
          <div className="col-span-3 flex flex-col overflow-hidden border-r border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-6 py-0 h-auto">
                <TabsTrigger 
                  value="details" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger 
                  value="notes" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="attachments" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attachments
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="details" className="mt-0 space-y-6">
                  {/* Asset & Location Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border p-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wrench className="h-4 w-4" />
                        Equipment
                      </div>
                      <p className="font-medium text-foreground">{request.equipment_name}</p>
                      {request.equipment_serial && (
                        <p className="text-xs text-muted-foreground font-mono">{request.equipment_serial}</p>
                      )}
                    </div>

                    <div className="rounded-lg border border-border p-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Location
                      </div>
                      <p className="font-medium text-foreground">{request.equipment_location || '—'}</p>
                    </div>
                  </div>

                  {/* Type, Priority, Dates */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Type</Label>
                      <Badge variant="outline" className="capitalize w-fit">
                        {request.request_type === 'corrective' ? '🔧 Corrective' : '📅 Preventive'}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Scheduled</Label>
                      <p className="font-medium text-sm">{formatDate(request.scheduled_date)}</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Due Date</Label>
                      <p className={cn(
                        'font-medium text-sm',
                        request.is_overdue ? 'text-destructive' : 'text-foreground'
                      )}>
                        {formatDate(request.due_date)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Duration</Label>
                      <p className="font-medium text-sm">{request.duration_hours ? `${request.duration_hours}h` : '—'}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Category & Team */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Category</Label>
                      <div className="flex items-center gap-2 font-medium">
                        {request.category_icon && <span>{request.category_icon}</span>}
                        <span>{request.category_name || '—'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Maintenance Team</Label>
                      <p className="font-medium">{request.team_name || '—'}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Description</Label>
                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm min-h-[80px]">
                      {request.description || 'No description provided.'}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0 space-y-4">
                  {/* Resolution Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution Notes</Label>
                    <Textarea
                      id="resolution"
                      placeholder="Add notes about how the issue was resolved..."
                      className="min-h-[150px] resize-none"
                      value={resolutionNotes || request.resolution_notes || ''}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                    />
                  </div>

                  {/* Instructions (placeholder) */}
                  <div className="space-y-2">
                    <Label>Work Instructions</Label>
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No work instructions available</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="mt-0">
                  <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                    <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No attachments</p>
                    <p className="text-xs mt-1">Images, manuals, and documents will appear here</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Side - Stage & Activity (40%) */}
          <div className="col-span-2 flex flex-col overflow-hidden bg-muted/20">
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Current Stage & Actions */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Current Stage</Label>
                <div className="flex items-center gap-3">
                  <div className={cn('h-4 w-4 rounded-full', currentStage.color)} />
                  <span className={cn('font-semibold text-lg', currentStage.textColor)}>{currentStage.label}</span>
                </div>

                {/* Stage Transition Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  {request.stage === 'new' && (
                    <Button
                      onClick={() => handleStageTransition('in_progress')}
                      className="gap-2 w-full"
                      disabled={updating}
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      Start Work
                    </Button>
                  )}
                  {request.stage === 'in_progress' && (
                    <>
                      <Button
                        onClick={() => handleStageTransition('repaired')}
                        className="gap-2 w-full bg-success hover:bg-success/90"
                        disabled={updating}
                      >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Mark Repaired
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStageTransition('scrap')}
                        className="gap-2 w-full"
                        disabled={updating}
                      >
                        <XCircle className="h-4 w-4" />
                        Mark as Scrap
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Assigned Technician */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Assigned Technician</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.technician_avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {request.technician_name || 'Unassigned'}
                    </p>
                    {request.team_name && (
                      <p className="text-xs text-muted-foreground">{request.team_name}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Timeline</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-xs text-muted-foreground">
                        {request.created_at && formatDistanceToNow(parseISO(request.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  {request.started_at && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Started</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(request.started_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.completed_at && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(request.completed_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Created By */}
              <Separator />
              <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Created By</Label>
                <p className="text-sm font-medium">{request.created_by_name || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
