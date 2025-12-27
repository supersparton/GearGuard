import { format, formatDistanceToNow, parseISO, isPast } from 'date-fns';

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

export function isOverdue(dueDateString: string): boolean {
  return isPast(parseISO(dueDateString));
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low':
      return 'priority-low';
    case 'medium':
      return 'priority-medium';
    case 'high':
      return 'priority-high';
    case 'critical':
      return 'priority-critical';
    default:
      return 'priority-low';
  }
}

export function getStageColor(stage: string): string {
  switch (stage) {
    case 'new':
      return 'stage-new';
    case 'in_progress':
      return 'stage-in-progress';
    case 'repaired':
      return 'stage-repaired';
    case 'scrap':
      return 'stage-scrap';
    default:
      return 'stage-new';
  }
}

export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'under_maintenance':
      return 'secondary';
    case 'scrapped':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}
