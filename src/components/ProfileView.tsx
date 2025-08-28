import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { useToast } from '@/hooks/use-toast';

export const ProfileView = () => {
  const { user, updateProfile } = useAuth();
  const { reports } = useReports();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    barangay: user?.barangay || '',
  });

  const userReports = reports.filter(report => report.reportedBy === user?.name);
  const userStats = {
    totalReports: userReports.length,
    pendingReports: userReports.filter(r => r.status === 'pending').length,
    resolvedReports: userReports.filter(r => r.status === 'resolved').length,
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      barangay: user?.barangay || '',
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mobile-container mobile-padding pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>
        {!isEditing && (
          <Button 
            variant="glass" 
            size="icon"
            onClick={() => setIsEditing(true)}
            className="rounded-full"
          >
            <Edit2 className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Profile Information */}
      <div className="glass-elevated rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.barangay} Resident</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-barangay" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Barangay
              </Label>
              <Input
                id="edit-barangay"
                value={formData.barangay}
                onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} variant="default" className="flex-1 rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1 rounded-xl">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{user?.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{user?.barangay}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">
                Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Activity Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">My Activity</h3>
        <div className="grid grid-cols-3 gap-3">
          <Card className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{userStats.totalReports}</p>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </Card>
          <Card className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-warning">{userStats.pendingReports}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </Card>
          <Card className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-success">{userStats.resolvedReports}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </Card>
        </div>
      </div>

      {/* App Information */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">About DigiBaryo</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Version:</strong> 1.0.0
          </p>
          <p>
            <strong className="text-foreground">Last Updated:</strong> August 2024
          </p>
          <p>
            DigiBaryo is your digital community platform designed to strengthen barangay connections, 
            improve communication between residents and local officials, and create a more engaged community.
          </p>
        </div>
      </div>
    </div>
  );
};