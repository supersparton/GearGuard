import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTeams, useCategories, useCreateTeam, useCreateCategory, useTeamMembers } from '@/hooks/useData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
    Plus,
    Users,
    Tag,
    Loader2,
    Settings2,
    ArrowLeft,
    UserPlus,
    Trash2,
    Edit,
    X
} from 'lucide-react';

// Team Form Modal (Create)
function TeamFormModal({
    open,
    onOpenChange,
    onSuccess
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createTeam = useCreateTeam();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Team name is required');
            return;
        }

        try {
            await createTeam.mutateAsync({ name, description });
            toast.success('Team created successfully');
            setName('');
            setDescription('');
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create team');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Maintenance Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name *</Label>
                        <Input
                            id="teamName"
                            placeholder="e.g. Mechanical Team A"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="teamDesc">Description</Label>
                        <Textarea
                            id="teamDesc"
                            placeholder="Brief description of the team..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createTeam.isPending}>
                            {createTeam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Team
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Team Edit Modal with Member Management
function TeamEditModal({
    team,
    open,
    onOpenChange,
    onSuccess
}: {
    team: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState(team?.name || '');
    const [description, setDescription] = useState(team?.description || '');
    const [saving, setSaving] = useState(false);
    const [addingMember, setAddingMember] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [memberRole, setMemberRole] = useState<'technician' | 'lead'>('technician');
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const { data: members = [], refetch: refetchMembers } = useTeamMembers(team?.id || null);

    useEffect(() => {
        if (team) {
            setName(team.name || '');
            setDescription(team.description || '');
        }
    }, [team]);

    // Fetch available technicians
    useEffect(() => {
        if (open && addingMember) {
            fetchAvailableUsers();
        }
    }, [open, addingMember]);

    const fetchAvailableUsers = async () => {
        setLoadingUsers(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .in('role', ['technician', 'manager'])
                .order('first_name');

            if (error) throw error;
            setAvailableUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Team name is required');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('maintenance_teams')
                .update({ name, description })
                .eq('id', team.id);

            if (error) throw error;
            toast.success('Team updated');
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update team');
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = async () => {
        if (!selectedUser) {
            toast.error('Please select a user');
            return;
        }

        try {
            const { error } = await supabase
                .from('team_members')
                .insert({
                    team_id: team.id,
                    user_id: selectedUser,
                    role: memberRole
                });

            if (error) throw error;
            toast.success('Member added');
            setSelectedUser('');
            setMemberRole('technician');
            setAddingMember(false);
            refetchMembers();
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (error) throw error;
            toast.success('Member removed');
            refetchMembers();
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to remove member');
        }
    };

    if (!team) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Team</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Team Name *</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[60px] resize-none"
                            />
                        </div>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>

                    {/* Team Members */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Team Members</h3>
                            {!addingMember && (
                                <Button size="sm" variant="outline" onClick={() => setAddingMember(true)}>
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Add Member
                                </Button>
                            )}
                        </div>

                        {/* Add Member Form */}
                        {addingMember && (
                            <div className="mb-4 p-3 rounded-lg border bg-muted/50 space-y-3">
                                <div className="space-y-2">
                                    <Label>Select User</Label>
                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingUsers ? "Loading..." : "Select a technician"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUsers.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.first_name} {user.last_name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Role in Team</Label>
                                    <Select value={memberRole} onValueChange={(v) => setMemberRole(v as 'technician' | 'lead')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="technician">Technician</SelectItem>
                                            <SelectItem value="lead">Team Lead</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleAddMember}>Add</Button>
                                    <Button size="sm" variant="outline" onClick={() => setAddingMember(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}

                        {/* Members List */}
                        <div className="space-y-2">
                            {members.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No members in this team yet.</p>
                            ) : (
                                members.map((member: any) => (
                                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                        <div>
                                            <p className="font-medium text-sm">{member.member_name}</p>
                                            <p className="text-xs text-muted-foreground">{member.member_email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={member.role === 'manager' ? 'default' : 'secondary'}>
                                                {member.role}
                                            </Badge>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveMember(member.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Category Edit Modal
function CategoryEditModal({
    category,
    open,
    onOpenChange,
    onSuccess
}: {
    category: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState(category?.name || '');
    const [icon, setIcon] = useState(category?.icon || '⚙️');
    const [color, setColor] = useState(category?.color || '#3b82f6');
    const [description, setDescription] = useState(category?.description || '');
    const [saving, setSaving] = useState(false);

    const iconOptions = ['⚙️', '🔧', '🔌', '🚗', '💻', '🏭', '🔩', '📦', '🛠️', '⚡'];

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setIcon(category.icon || '⚙️');
            setColor(category.color || '#3b82f6');
            setDescription(category.description || '');
        }
    }, [category]);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('categories')
                .update({ name, icon, color, description })
                .eq('id', category.id);

            if (error) throw error;
            toast.success('Category updated');
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update category');
        } finally {
            setSaving(false);
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Category Name *</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <div className="flex flex-wrap gap-2">
                            {iconOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-all',
                                        icon === emoji
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                            : 'border-border hover:bg-muted'
                                    )}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-11 w-14 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-11 flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[60px] resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Category Form Modal (Create)
function CategoryFormModal({
    open,
    onOpenChange,
    onSuccess
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('⚙️');
    const [color, setColor] = useState('#3b82f6');
    const [description, setDescription] = useState('');
    const createCategory = useCreateCategory();

    const iconOptions = ['⚙️', '🔧', '🔌', '🚗', '💻', '🏭', '🔩', '📦', '🛠️', '⚡'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            await createCategory.mutateAsync({ name, icon, color, description });
            toast.success('Category created successfully');
            setName('');
            setIcon('⚙️');
            setColor('#3b82f6');
            setDescription('');
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to create category');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="catName">Category Name *</Label>
                        <Input
                            id="catName"
                            placeholder="e.g. CNC Machines"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <div className="flex flex-wrap gap-2">
                            {iconOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-all',
                                        icon === emoji
                                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                            : 'border-border hover:bg-muted'
                                    )}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catColor">Color</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                id="catColor"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-11 w-14 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-11 flex-1"
                                placeholder="#3b82f6"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="catDesc">Description</Label>
                        <Textarea
                            id="catDesc"
                            placeholder="Brief description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[60px] resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createCategory.isPending}>
                            {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Team Card with Edit Button
function TeamCard({ team, onEdit, onRefresh }: { team: any; onEdit: () => void; onRefresh: () => void }) {
    const { data: members = [], isLoading } = useTeamMembers(team.id);

    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        {team.description && (
                            <CardDescription className="mt-1">{team.description}</CardDescription>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {team.member_count || 0} members
                        </Badge>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={onEdit}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : members.length > 0 ? (
                    <div className="space-y-2">
                        {members.slice(0, 3).map((member: any) => (
                            <div key={member.id} className="flex items-center justify-between text-sm">
                                <span>{member.member_name}</span>
                                <Badge
                                    variant={member.role === 'manager' ? 'default' : 'secondary'}
                                    className="text-xs"
                                >
                                    {member.role}
                                </Badge>
                            </div>
                        ))}
                        {members.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{members.length - 3} more</p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No members yet</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ManagementPage() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const { data: teams = [], isLoading: teamsLoading, refetch: refetchTeams } = useTeams();
    const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();


    // Everyone can now access this page

    return (
        <Layout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Management</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage teams and equipment categories
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="teams" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="teams" className="gap-2">
                            <Users className="h-4 w-4" />
                            Maintenance Teams
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="gap-2">
                            <Tag className="h-4 w-4" />
                            Categories
                        </TabsTrigger>
                    </TabsList>

                    {/* Teams Tab */}
                    <TabsContent value="teams" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Maintenance Teams</h2>
                                <p className="text-sm text-muted-foreground">
                                    Create and manage maintenance teams with their members
                                </p>
                            </div>
                            <Button onClick={() => setTeamModalOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Team
                            </Button>
                        </div>

                        {teamsLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : teams.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 font-medium">No teams yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Create your first maintenance team to get started
                                    </p>
                                    <Button onClick={() => setTeamModalOpen(true)} className="mt-4 gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Team
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {teams.map((team) => (
                                    <TeamCard
                                        key={team.id}
                                        team={team}
                                        onEdit={() => setEditingTeam(team)}
                                        onRefresh={refetchTeams}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Categories Tab */}
                    <TabsContent value="categories" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Equipment Categories</h2>
                                <p className="text-sm text-muted-foreground">
                                    Organize equipment by category for easier management
                                </p>
                            </div>
                            <Button onClick={() => setCategoryModalOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </div>

                        {categoriesLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : categories.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Tag className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 font-medium">No categories yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Create categories to organize your equipment
                                    </p>
                                    <Button onClick={() => setCategoryModalOpen(true)} className="mt-4 gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Category
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {categories.map((cat) => (
                                    <Card
                                        key={cat.id}
                                        className="group hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => setEditingCategory(cat)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                                                    style={{ backgroundColor: `${cat.color}20` }}
                                                >
                                                    {cat.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium truncate">{cat.name}</h3>
                                                        <Edit className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    {cat.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {cat.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            <TeamFormModal
                open={teamModalOpen}
                onOpenChange={setTeamModalOpen}
                onSuccess={refetchTeams}
            />
            <TeamEditModal
                team={editingTeam}
                open={!!editingTeam}
                onOpenChange={(open) => !open && setEditingTeam(null)}
                onSuccess={refetchTeams}
            />
            <CategoryFormModal
                open={categoryModalOpen}
                onOpenChange={setCategoryModalOpen}
                onSuccess={refetchCategories}
            />
            <CategoryEditModal
                category={editingCategory}
                open={!!editingCategory}
                onOpenChange={(open) => !open && setEditingCategory(null)}
                onSuccess={refetchCategories}
            />
        </Layout>
    );
}
