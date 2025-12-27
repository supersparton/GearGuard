import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

interface AlertsPanelProps {
  alerts: Alert[];
  isLoading?: boolean;
}

export function AlertsPanel({ alerts, isLoading }: AlertsPanelProps) {
  const navigate = useNavigate();

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10',
          icon: AlertTriangle,
          iconColor: 'text-destructive',
        };
      case 'warning':
        return {
          bg: 'bg-warning/5 border-warning/20 hover:bg-warning/10',
          icon: AlertCircle,
          iconColor: 'text-warning',
        };
      case 'info':
        return {
          bg: 'bg-primary/5 border-primary/20 hover:bg-primary/10',
          icon: Info,
          iconColor: 'text-primary',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-16 rounded-lg bg-muted" />
            <div className="h-16 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Alerts</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
            <svg className="h-6 w-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">All systems healthy</p>
          <p className="text-xs text-muted-foreground">No critical alerts at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-semibold text-foreground mb-4">Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          const IconComponent = styles.icon;
          
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-4 transition-colors',
                styles.bg
              )}
            >
              <IconComponent className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.iconColor)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
              </div>
              {alert.action && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-shrink-0"
                  onClick={() => navigate(alert.action!.href)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
