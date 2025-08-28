import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Shield, MessageCircle } from 'lucide-react';
import communityHero from '@/assets/community-hero.jpg';
import digiLogo from '@/assets/digibaryo-logo.png';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${communityHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/80"></div>
        </div>
        
        <div className="relative z-10 mobile-container mobile-padding flex flex-col h-full justify-center text-center">
          <div className="mb-8">
            <img 
              src={digiLogo} 
              alt="DigiBaryo Logo" 
              className="w-24 h-24 mx-auto mb-6 rounded-3xl shadow-xl"
            />
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">
              Welcome to DigiBaryo
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Your digital community platform for barangay residents. Stay connected, report issues, and build a stronger community together.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-4 mb-8">
            <div className="glass rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-community/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-community" />
                </div>
                <h3 className="font-semibold text-foreground">Community Reports</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View and track community issues, infrastructure problems, and local updates.
              </p>
            </div>

            <div className="glass rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Secure Platform</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Safe and secure login system to protect your personal information.
              </p>
            </div>

            <div className="glass rounded-2xl p-4 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Easy Communication</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Search and filter reports to find information relevant to your area.
              </p>
            </div>
          </div>

          <Button 
            onClick={onGetStarted}
            variant="gradient"
            size="lg"
            className="w-full rounded-2xl shadow-xl"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};