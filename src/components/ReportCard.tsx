import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, AlertTriangle, CheckCircle, Pause } from 'lucide-react';
import { Report } from '@/contexts/ReportsContext';

interface ReportCardProps {
  report: Report;
}

const categoryIcons = {
  infrastructure: '🏗️',
  safety: '🛡️',
  environment: '🌱',
  health: '🏥',
  education: '📚',
  other: '📋',
};

const statusConfig = {
  pending: {
    color: 'bg-warning/20 text-warning-foreground border-warning/30',
    icon: AlertTriangle,
    label: 'Pending'
  },
  'in-progress': {
    color: 'bg-accent/20 text-accent-foreground border-accent/30',
    icon: Pause,
    label: 'In Progress'
  },
  resolved: {
    color: 'bg-success/20 text-success-foreground border-success/30',
    icon: CheckCircle,
    label: 'Resolved'
  }
};

const priorityConfig = {
  low: 'bg-muted/60 text-muted-foreground',
  medium: 'bg-warning/20 text-warning-foreground',
  high: 'bg-destructive/20 text-destructive-foreground',
};

export const ReportCard = ({ report }: ReportCardProps) => {
  const statusInfo = statusConfig[report.status];
  const StatusIcon = statusInfo.icon;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass rounded-2xl p-4 transition-smooth hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcons[report.category]}</span>
          <h3 className="font-semibold text-foreground text-sm leading-tight flex-1">
            {report.title}
          </h3>
        </div>
        <Badge className={`${statusInfo.color} text-xs px-2 py-1 rounded-full border`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {report.description}
      </p>

      {/* Meta Information */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{report.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{report.reportedBy}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${priorityConfig[report.priority]} text-xs px-2 py-0.5 rounded-full`}>
              {report.priority.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{formatDate(report.reportedAt)}</span>
          {report.resolvedAt && (
            <span className="text-success">
              • Resolved {formatDate(report.resolvedAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};