import { useState, useEffect } from 'react';
import { Shield, Key, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const AdminView = () => {
  const { isAdmin, isLoading } = useUserRole();
  const { toast } = useToast();
  const [barangayIdCount, setBarangayIdCount] = useState(1);
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    availableIds: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [profilesRes, reportsRes, idsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('id, status', { count: 'exact' }),
        supabase.from('barangay_ids').select('id', { count: 'exact' }).eq('is_used', false),
      ]);

      const pendingCount = reportsRes.data?.filter(r => r.status === 'pending').length || 0;

      setStats({
        totalUsers: profilesRes.count || 0,
        totalReports: reportsRes.count || 0,
        pendingReports: pendingCount,
        availableIds: idsRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateBarangayId = () => {
    const prefix = 'BRGY';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleGenerateIds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newIds = Array.from({ length: barangayIdCount }, () => generateBarangayId());
      
      const { error } = await supabase
        .from('barangay_ids')
        .insert(newIds.map(id => ({
          barangay_id: id,
          generated_by: user.id,
          is_used: false,
        })));

      if (error) throw error;

      setGeneratedIds(newIds);
      toast({
        title: 'Success!',
        description: `Generated ${barangayIdCount} new Barangay ID${barangayIdCount > 1 ? 's' : ''}`,
      });
      fetchStats();
    } catch (error) {
      console.error('Error generating IDs:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate Barangay IDs',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Barangay ID copied to clipboard',
    });
  };

  if (isLoading) {
    return (
      <div className="mobile-container py-20">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mobile-container py-20">
        <div className="glass rounded-2xl p-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container py-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage Barangay IDs, users, and community reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.pendingReports}</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Key className="w-4 h-4" />
              Available IDs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.availableIds}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="barangay-ids" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="barangay-ids">Barangay IDs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="barangay-ids" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Generate Barangay IDs
              </CardTitle>
              <CardDescription>
                Create new Barangay IDs for user registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={barangayIdCount}
                  onChange={(e) => setBarangayIdCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                  placeholder="Number of IDs"
                  className="flex-1"
                />
                <Button onClick={handleGenerateIds} className="shrink-0">
                  Generate
                </Button>
              </div>

              {generatedIds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Recently Generated IDs:
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {generatedIds.map((id, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <code className="text-sm font-mono">{id}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(id)}
                        >
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ReportsManagement = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('reported_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Report status updated',
      });
      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to update report status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading reports...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <Card className="glass">
          <CardContent className="py-8 text-center text-muted-foreground">
            No reports found
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="glass">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <Badge
                  variant={
                    report.status === 'resolved'
                      ? 'default'
                      : report.status === 'in-progress'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {report.status}
                </Badge>
              </div>
              <CardDescription>{report.reported_by}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{report.description}</p>
              <div className="flex gap-2">
                {report.status !== 'in-progress' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateReportStatus(report.id, 'in-progress')}
                  >
                    Mark In Progress
                  </Button>
                )}
                {report.status !== 'resolved' && (
                  <Button
                    size="sm"
                    onClick={() => updateReportStatus(report.id, 'resolved')}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
