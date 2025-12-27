import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  progress?: number;
  trend?: {
    value: number;
    label: string;
  };
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default', 
  progress,
  trend 
}: KPICardProps) {
  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  const valueStyles = {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  const progressStyles = {
    default: 'bg-muted-foreground',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('rounded-xl p-3 transition-transform group-hover:scale-105', iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            trend.value >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={cn('text-3xl font-bold tracking-tight', valueStyles[variant])}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className={cn('h-full rounded-full transition-all duration-500', progressStyles[variant])}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
