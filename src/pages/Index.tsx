import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { AuthForms } from '@/components/AuthForms';
import { Dashboard } from '@/components/Dashboard';
import { ReportsView } from '@/components/ReportsView';
import { SearchView } from '@/components/SearchView';
import { ProfileView } from '@/components/ProfileView';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading DigiBaryo...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!showAuth) {
      return <WelcomeScreen onGetStarted={() => setShowAuth(true)} />;
    }
    return <AuthForms onBack={() => setShowAuth(false)} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'reports':
        return <ReportsView />;
      case 'search':
        return <SearchView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
