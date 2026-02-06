import { useState, useEffect } from 'react';
import { TrendingUp, FileText, Users, CheckCircle, Clock, AlertTriangle, PieChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Stats {
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
  highPriorityReports: number;
  categoryBreakdown: { name: string; value: number }[];
  recentActivity: { date: string; count: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];
const STATUS_COLORS = ['hsl(45, 93%, 47%)', 'hsl(215, 91%, 60%)', 'hsl(142, 76%, 36%)'];

export const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    highPriorityReports: 0,
    categoryBreakdown: [],
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [profilesRes, reportsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('*'),
      ]);

      const reports = reportsRes.data || [];
      
      // Status counts
      const pendingReports = reports.filter(r => r.status === 'pending').length;
      const inProgressReports = reports.filter(r => r.status === 'in-progress').length;
      const resolvedReports = reports.filter(r => r.status === 'resolved').length;
      const highPriorityReports = reports.filter(r => r.priority === 'high').length;

      // Category breakdown
      const categoryMap = new Map<string, number>();
      reports.forEach(r => {
        categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + 1);
      });
      const categoryBreakdown = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // Recent activity (last 7 days)
      const today = new Date();
      const recentActivity: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = reports.filter(r => 
          r.reported_at.split('T')[0] === dateStr
        ).length;
        recentActivity.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count,
        });
      }

      setStats({
        totalUsers: profilesRes.count || 0,
        totalReports: reports.length,
        pendingReports,
        inProgressReports,
        resolvedReports,
        highPriorityReports,
        categoryBreakdown,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusData = [
    { name: 'Pending', value: stats.pendingReports },
    { name: 'In Progress', value: stats.inProgressReports },
    { name: 'Resolved', value: stats.resolvedReports },
  ];

  const resolutionRate = stats.totalReports > 0 
    ? Math.round((stats.resolvedReports / stats.totalReports) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered residents</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">{stats.resolvedReports} resolved</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.highPriorityReports}</div>
            <p className="text-xs text-muted-foreground">Urgent issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Report Status Distribution
            </CardTitle>
            <CardDescription>Current status of all reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Pending: {stats.pendingReports}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm">In Progress: {stats.inProgressReports}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Resolved: {stats.resolvedReports}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Reports submitted in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentActivity}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reports by Category
          </CardTitle>
          <CardDescription>Distribution of reports across categories</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.categoryBreakdown.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No reports yet</p>
          ) : (
            <div className="space-y-3">
              {stats.categoryBreakdown.map((category, index) => {
                const percentage = stats.totalReports > 0 
                  ? Math.round((category.value / stats.totalReports) * 100) 
                  : 0;
                return (
                  <div key={category.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">
                        {category.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
