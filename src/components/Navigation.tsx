import { Home, FileText, User, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-glass/95 backdrop-blur-lg border-t border-glass-border/50 z-50">
      <div className="mobile-container py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col gap-1 h-auto py-2 px-3 transition-smooth ${
                  isActive 
                    ? 'text-primary bg-primary/10 rounded-xl' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex flex-col gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-destructive transition-smooth"
          >
            <LogOut size={20} />
            <span className="text-xs font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};