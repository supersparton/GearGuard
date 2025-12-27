import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Box, Factory } from 'lucide-react';
import { useEquipment, useEquipmentDefaults } from '@/hooks/useEquipment';
import { useWorkCenters } from '@/hooks/useWorkCenters';
import { useCreateRequest } from '@/hooks/useRequests';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RequestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestFormModal({ open, onOpenChange }: RequestFormModalProps) {
  const { user } = useAuth();
  const { data: equipment = [], isLoading: loadingEquipment } = useEquipment();
  const { data: workCenters = [], isLoading: loadingWorkCenters } = useWorkCenters();
  const createRequest = useCreateRequest();

  const [targetType, setTargetType] = useState<'equipment' | 'work_center'>('equipment');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment_id: '',
    work_center_id: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    request_type: 'corrective' as 'corrective' | 'preventive',
    due_date: undefined as Date | undefined,
  });

  // Auto-fill from equipment defaults
  const { data: defaults } = useEquipmentDefaults(formData.equipment_id || null);
  const selectedEquipment = equipment.find(e => e.id === formData.equipment_id);
  const selectedWorkCenter = workCenters.find(wc => wc.id === formData.work_center_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    // Validate target selection
    if (targetType === 'equipment' && !formData.equipment_id) {
      toast.error('Please select equipment');
      return;
    }
    if (targetType === 'work_center' && !formData.work_center_id) {
      toast.error('Please select a work center');
      return;
    }

    try {
      await createRequest.mutateAsync({
        subject: formData.subject,
        description: formData.description || undefined,
        equipment_id: targetType === 'equipment' ? formData.equipment_id : '',
        priority: formData.priority,
        request_type: formData.request_type,
        due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : undefined,
        created_by: user.id,
        technician_id: defaults?.default_technician_id || selectedEquipment?.default_technician_id || undefined,
        category_id: defaults?.category_id || selectedEquipment?.category_id || undefined,
      });

      toast.success('Request created successfully');
      onOpenChange(false);

      // Reset form
      setFormData({
        subject: '',
        description: '',
        equipment_id: '',
        work_center_id: '',
        priority: 'medium',
        request_type: 'corrective',
        due_date: undefined,
      });
      setTargetType('equipment');
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Maintenance Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Type Toggle */}
          <div className="space-y-2">
            <Label>Maintenance For *</Label>
            <ToggleGroup
              type="single"
              value={targetType}
              onValueChange={(value) => {
                if (value) {
                  setTargetType(value as 'equipment' | 'work_center');
                  // Reset selections when switching
                  setFormData({ ...formData, equipment_id: '', work_center_id: '' });
                }
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="equipment" className="gap-2 px-4">
                <Box className="h-4 w-4" />
                Equipment
              </ToggleGroupItem>
              <ToggleGroupItem value="work_center" className="gap-2 px-4">
                <Factory className="h-4 w-4" />
                Work Center
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of the issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the maintenance request..."
                  className="min-h-[100px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Equipment Dropdown (shown when targetType is 'equipment') */}
              {targetType === 'equipment' && (
                <div className="space-y-2">
                  <Label htmlFor="equipment">Equipment *</Label>
                  <Select
                    value={formData.equipment_id}
                    onValueChange={(value) => setFormData({ ...formData, equipment_id: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={loadingEquipment ? 'Loading...' : 'Select equipment'} />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id!}>
                          <span className="flex items-center gap-2">
                            <span>{eq.category_icon}</span>
                            <span>{eq.name}</span>
                            <span className="text-muted-foreground">({eq.serial_number})</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Work Center Dropdown (shown when targetType is 'work_center') */}
              {targetType === 'work_center' && (
                <div className="space-y-2">
                  <Label htmlFor="workCenter">Work Center *</Label>
                  <Select
                    value={formData.work_center_id}
                    onValueChange={(value) => setFormData({ ...formData, work_center_id: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={loadingWorkCenters ? 'Loading...' : 'Select work center'} />
                    </SelectTrigger>
                    <SelectContent>
                      {workCenters.map((wc) => (
                        <SelectItem key={wc.id} value={wc.id}>
                          <span className="flex items-center gap-2">
                            <Factory className="h-4 w-4 text-muted-foreground" />
                            <span>{wc.name}</span>
                            {wc.code && <span className="text-muted-foreground">({wc.code})</span>}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Right Column - Auto-filled Fields */}
            <div className="space-y-4">
              {targetType === 'equipment' ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Category (Auto-filled)</Label>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {selectedEquipment?.category_icon && <span>{selectedEquipment.category_icon}</span>}
                      {defaults?.category_name || selectedEquipment?.category_name || '—'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Maintenance Team (Auto-filled)</Label>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {defaults?.team_name || selectedEquipment?.team_name || '—'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Default Technician (Auto-filled)</Label>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {defaults?.technician_name || selectedEquipment?.default_technician_name || '—'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Location</Label>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {selectedEquipment?.location || '—'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Work Center Code</Label>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {selectedWorkCenter?.code || '—'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Cost per Hour</Label>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {selectedWorkCenter?.cost_per_hour ? `$${selectedWorkCenter.cost_per_hour.toFixed(2)}` : '—'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">OEE Target</Label>
                    <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm">
                      {selectedWorkCenter?.oee_target ? `${selectedWorkCenter.oee_target}%` : '—'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Row - Priority, Due Date, Type */}
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-500" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="critical">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Critical
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-11 w-full justify-start text-left font-normal',
                      !formData.due_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.request_type}
                onValueChange={(value: 'corrective' | 'preventive') =>
                  setFormData({ ...formData, request_type: value })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">🔧 Corrective</SelectItem>
                  <SelectItem value="preventive">📅 Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createRequest.isPending ||
                (targetType === 'equipment' && !formData.equipment_id) ||
                (targetType === 'work_center' && !formData.work_center_id)
              }
            >
              {createRequest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
