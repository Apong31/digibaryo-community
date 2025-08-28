import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { ReportCard } from './ReportCard';

export const Dashboard = () => {
  const { user } = useAuth();
  const { reports } = useReports();

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const recentReports = reports.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="mobile-container mobile-padding pb-24">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Resident'}!
        </h1>
        <p className="text-muted-foreground">
          Welcome to {user?.barangay || 'your barangay'} community platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Community Updates</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-community rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-foreground">Barangay Assembly Meeting</p>
              <p className="text-xs text-muted-foreground">Next Saturday, 2:00 PM at the Community Center</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-foreground">Clean-up Drive</p>
              <p className="text-xs text-muted-foreground">Join us this Sunday morning for community cleanup</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-foreground">New Health Programs</p>
              <p className="text-xs text-muted-foreground">Free health checkups available at the health center</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};