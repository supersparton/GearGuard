import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useWorkCenters, useCreateWorkCenter, useUpdateWorkCenter, useDeleteWorkCenter, WorkCenter } from '@/hooks/useWorkCenters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Plus, Factory, Loader2, MoreHorizontal, Edit, Trash2, Target, DollarSign, Gauge } from 'lucide-react';

// Work Center Form Modal
function WorkCenterFormModal({
    workCenter,
    open,
    onOpenChange,
    onSuccess
}: {
    workCenter?: WorkCenter | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState(workCenter?.name || '');
    const [code, setCode] = useState(workCenter?.code || '');
    const [costPerHour, setCostPerHour] = useState(workCenter?.cost_per_hour?.toString() || '');
    const [oeeTarget, setOeeTarget] = useState(workCenter?.oee_target?.toString() || '');
    const [capacityEfficiency, setCapacityEfficiency] = useState(workCenter?.capacity_efficiency?.toString() || '');

    const createWorkCenter = useCreateWorkCenter();
    const updateWorkCenter = useUpdateWorkCenter();
    const isEditing = !!workCenter;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Work center name is required');
            return;
        }

        try {
            const data = {
                name: name.trim(),
                code: code.trim() || null,
                cost_per_hour: costPerHour ? parseFloat(costPerHour) : null,
                oee_target: oeeTarget ? parseFloat(oeeTarget) : null,
                capacity_efficiency: capacityEfficiency ? parseFloat(capacityEfficiency) : null,
            };

            if (isEditing) {
                await updateWorkCenter.mutateAsync({ id: workCenter.id, ...data });
                toast.success('Work center updated');
            } else {
                await createWorkCenter.mutateAsync(data);
                toast.success('Work center created');
            }

            onOpenChange(false);
            onSuccess();

            // Reset form
            setName('');
            setCode('');
            setCostPerHour('');
            setOeeTarget('');
            setCapacityEfficiency('');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save work center');
        }
    };

    const isPending = createWorkCenter.isPending || updateWorkCenter.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Work Center' : 'Create Work Center'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Assembly Line 1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            placeholder="e.g. ASM-01"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="costPerHour">Cost per Hour ($)</Label>
                            <Input
                                id="costPerHour"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={costPerHour}
                                onChange={(e) => setCostPerHour(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oeeTarget">OEE Target (%)</Label>
                            <Input
                                id="oeeTarget"
                                type="number"
                                step="0.1"
                                placeholder="85"
                                value={oeeTarget}
                                onChange={(e) => setOeeTarget(e.target.value)}
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacityEfficiency">Capacity Time Efficiency (%)</Label>
                        <Input
                            id="capacityEfficiency"
                            type="number"
                            step="0.1"
                            placeholder="100"
                            value={capacityEfficiency}
                            onChange={(e) => setCapacityEfficiency(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function WorkCentersPage() {
    const { data: workCenters = [], isLoading, refetch } = useWorkCenters();
    const deleteWorkCenter = useDeleteWorkCenter();
    const [formOpen, setFormOpen] = useState(false);
    const [editingWorkCenter, setEditingWorkCenter] = useState<WorkCenter | null>(null);

    const handleDelete = async (id: string) => {
        try {
            await deleteWorkCenter.mutateAsync(id);
            toast.success('Work center deleted');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete');
        }
    };

    return (
        <Layout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Factory className="h-6 w-6" />
                            Work Centers
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage production areas and assembly lines
                        </p>
                    </div>
                    <Button onClick={() => setFormOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Work Center
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <Factory className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{workCenters.length}</p>
                                <p className="text-sm text-muted-foreground">Total Work Centers</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                                <Target className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {workCenters.filter(wc => wc.oee_target && wc.oee_target >= 85).length}
                                </p>
                                <p className="text-sm text-muted-foreground">OEE Target ≥85%</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                                <DollarSign className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    ${workCenters.reduce((sum, wc) => sum + (wc.cost_per_hour || 0), 0).toFixed(0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Cost/Hour</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Work Centers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : workCenters.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Factory className="h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 font-medium">No work centers yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create your first work center to track production areas
                                </p>
                                <Button onClick={() => setFormOpen(true)} className="mt-4 gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Work Center
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead className="text-right">Cost/Hour</TableHead>
                                        <TableHead className="text-right">OEE Target</TableHead>
                                        <TableHead className="text-right">Efficiency</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workCenters.map((wc) => (
                                        <TableRow key={wc.id}>
                                            <TableCell className="font-medium">{wc.name}</TableCell>
                                            <TableCell>
                                                {wc.code ? (
                                                    <Badge variant="outline">{wc.code}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {wc.cost_per_hour ? `$${wc.cost_per_hour.toFixed(2)}` : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {wc.oee_target ? (
                                                    <Badge
                                                        variant={wc.oee_target >= 85 ? 'default' : 'secondary'}
                                                        className={wc.oee_target >= 85 ? 'bg-green-100 text-green-700' : ''}
                                                    >
                                                        {wc.oee_target}%
                                                    </Badge>
                                                ) : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {wc.capacity_efficiency ? `${wc.capacity_efficiency}%` : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setEditingWorkCenter(wc)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(wc.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create Modal */}
            <WorkCenterFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                onSuccess={refetch}
            />

            {/* Edit Modal */}
            <WorkCenterFormModal
                workCenter={editingWorkCenter}
                open={!!editingWorkCenter}
                onOpenChange={(open) => !open && setEditingWorkCenter(null)}
                onSuccess={refetch}
            />
        </Layout>
    );
}
