import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus } from 'lucide-react';
import { useCategories, useTeams, useCreateCategory, useCreateTeam } from '@/hooks/useData';
import { useCreateEquipment } from '@/hooks/useEquipment';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EquipmentFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EquipmentFormModal({ open, onOpenChange }: EquipmentFormModalProps) {
    const { profile } = useAuth();
    const { data: categories = [] } = useCategories();
    const { data: teams = [] } = useTeams();
    const createEquipment = useCreateEquipment();
    const createCategory = useCreateCategory();
    const createTeam = useCreateTeam();

    const isAdminOrManager = profile?.role === 'admin' || profile?.role === 'manager';

    // State for inline add forms
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('⚙️');
    const [newTeamName, setNewTeamName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        description: '',
        category_id: '',
        department: '',
        location: '',
        maintenance_team_id: '',
        purchase_date: undefined as Date | undefined,
        warranty_expiry: undefined as Date | undefined,
        notes: '',
    });

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Category name is required');
            return;
        }
        try {
            const newCat = await createCategory.mutateAsync({
                name: newCategoryName,
                icon: newCategoryIcon
            });
            setFormData({ ...formData, category_id: newCat.id });
            setNewCategoryName('');
            setNewCategoryIcon('⚙️');
            setShowAddCategory(false);
            toast.success('Category created');
        } catch (error: any) {
            console.error('Category creation error:', error);
            toast.error(error?.message || 'Failed to create category - check RLS policies');
        }
    };

    const handleAddTeam = async () => {
        if (!newTeamName.trim()) {
            toast.error('Team name is required');
            return;
        }
        try {
            const newTeam = await createTeam.mutateAsync({ name: newTeamName });
            setFormData({ ...formData, maintenance_team_id: newTeam.id });
            setNewTeamName('');
            setShowAddTeam(false);
            toast.success('Team created');
        } catch (error: any) {
            console.error('Team creation error:', error);
            toast.error(error?.message || 'Failed to create team - check RLS policies');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.serial_number || !formData.department || !formData.location || !formData.maintenance_team_id || !formData.purchase_date) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await createEquipment.mutateAsync({
                name: formData.name,
                serial_number: formData.serial_number,
                description: formData.description || undefined,
                category_id: formData.category_id || undefined,
                department: formData.department,
                location: formData.location,
                maintenance_team_id: formData.maintenance_team_id,
                purchase_date: format(formData.purchase_date, 'yyyy-MM-dd'),
                warranty_expiry: formData.warranty_expiry ? format(formData.warranty_expiry, 'yyyy-MM-dd') : undefined,
                notes: formData.notes || undefined,
            });

            toast.success('Equipment added successfully');
            onOpenChange(false);

            // Reset form
            setFormData({
                name: '',
                serial_number: '',
                description: '',
                category_id: '',
                department: '',
                location: '',
                maintenance_team_id: '',
                purchase_date: undefined,
                warranty_expiry: undefined,
                notes: '',
            });
        } catch (error) {
            toast.error('Failed to add equipment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add Equipment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. CNC Machine A1"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serial_number">Serial Number *</Label>
                            <Input
                                id="serial_number"
                                placeholder="e.g. CNC-2024-001"
                                value={formData.serial_number}
                                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                                required
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the equipment..."
                            className="min-h-[80px] resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Category & Team */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Category with Add option */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Category</Label>
                                {isAdminOrManager && !showAddCategory && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs gap-1"
                                        onClick={() => setShowAddCategory(true)}
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add New
                                    </Button>
                                )}
                            </div>

                            {showAddCategory ? (
                                <div className="space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Icon"
                                            value={newCategoryIcon}
                                            onChange={(e) => setNewCategoryIcon(e.target.value)}
                                            className="w-16 text-center"
                                        />
                                        <Input
                                            placeholder="Category name"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleAddCategory}
                                            disabled={createCategory.isPending}
                                        >
                                            {createCategory.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAddCategory(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Select
                                    value={formData.category_id}
                                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                <span className="flex items-center gap-2">
                                                    <span>{cat.icon}</span>
                                                    <span>{cat.name}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                        {categories.length === 0 && (
                                            <div className="p-2 text-center text-sm text-muted-foreground">
                                                No categories yet
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Maintenance Team with Add option */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Maintenance Team *</Label>
                                {isAdminOrManager && !showAddTeam && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs gap-1"
                                        onClick={() => setShowAddTeam(true)}
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add New
                                    </Button>
                                )}
                            </div>

                            {showAddTeam ? (
                                <div className="space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
                                    <Input
                                        placeholder="Team name"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleAddTeam}
                                            disabled={createTeam.isPending}
                                        >
                                            {createTeam.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAddTeam(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Select
                                    value={formData.maintenance_team_id}
                                    onValueChange={(value) => setFormData({ ...formData, maintenance_team_id: value })}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id!}>
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                        {teams.length === 0 && (
                                            <div className="p-2 text-center text-sm text-muted-foreground">
                                                No teams yet
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department *</Label>
                            <Input
                                id="department"
                                placeholder="e.g. Production"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                placeholder="e.g. Building A, Floor 1"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Purchase Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'h-11 w-full justify-start text-left font-normal',
                                            !formData.purchase_date && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.purchase_date ? format(formData.purchase_date, 'PPP') : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.purchase_date}
                                        onSelect={(date) => setFormData({ ...formData, purchase_date: date })}
                                        initialFocus
                                        className="pointer-events-auto"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Warranty Expiry</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'h-11 w-full justify-start text-left font-normal',
                                            !formData.warranty_expiry && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.warranty_expiry ? format(formData.warranty_expiry, 'PPP') : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.warranty_expiry}
                                        onSelect={(date) => setFormData({ ...formData, warranty_expiry: date })}
                                        initialFocus
                                        className="pointer-events-auto"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Additional notes..."
                            className="min-h-[60px] resize-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="border-t border-border pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createEquipment.isPending}>
                            {createEquipment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Equipment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
