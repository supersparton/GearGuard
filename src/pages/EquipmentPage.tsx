import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { mockEquipment, Equipment } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { capitalizeFirst } from '@/utils/helpers';
import { Plus, Search, Filter, MoreHorizontal, Wrench } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function SmartButton({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null;
  
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105"
    >
      <Wrench className="h-3 w-3" />
      <span>{count} open</span>
    </button>
  );
}

function StatusBadge({ status }: { status: Equipment['status'] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 text-xs font-medium',
        status === 'active' && 'bg-success/10 text-success',
        status === 'under_maintenance' && 'bg-warning/10 text-warning',
        status === 'scrapped' && 'bg-muted text-muted-foreground'
      )}
    >
      {capitalizeFirst(status)}
    </Badge>
  );
}

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [equipment] = useState<Equipment[]>(mockEquipment);

  const filteredEquipment = equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Equipment</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and track all your equipment
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Equipment Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.department}</div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {item.serial_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.category_icon}</span>
                      <span>{item.category_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <SmartButton
                      count={item.open_request_count}
                      onClick={() => console.log('View requests for:', item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Create Request</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
