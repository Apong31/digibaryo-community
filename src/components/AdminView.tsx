import { Shield, Users, FileText, BarChart3, Key } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import { UserManagement } from '@/components/admin/UserManagement';
import { ReportManagement } from '@/components/admin/ReportManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { BarangayIdGenerator } from '@/components/admin/BarangayIdGenerator';

export const AdminView = () => {
  const { isAdmin, isLoading } = useUserRole();

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
          Manage users, reports, and community analytics
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="analytics" className="flex flex-col gap-1 py-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex flex-col gap-1 py-2">
            <FileText className="w-4 h-4" />
            <span className="text-xs">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex flex-col gap-1 py-2">
            <Users className="w-4 h-4" />
            <span className="text-xs">Users</span>
          </TabsTrigger>
          <TabsTrigger value="barangay-ids" className="flex flex-col gap-1 py-2">
            <Key className="w-4 h-4" />
            <span className="text-xs">IDs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-0">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <ReportManagement />
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <UserManagement />
        </TabsContent>

        <TabsContent value="barangay-ids" className="mt-0">
          <BarangayIdGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};
