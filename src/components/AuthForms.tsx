import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthFormsProps {
  onBack: () => void;
}

export const AuthForms = ({ onBack }: AuthFormsProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    barangay: '',
    phone: '',
  });
  const { login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          toast({
            title: 'Login Failed',
            description: 'Invalid email or password. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        if (!formData.name || !formData.barangay || !formData.phone) {
          toast({
            title: 'Missing Information',
            description: 'Please fill in all required fields.',
            variant: 'destructive',
          });
          return;
        }
        
        success = await signup(formData);
        if (!success) {
          toast({
            title: 'Signup Failed',
            description: 'Email already exists. Please use a different email.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome to DigiBaryo!',
            description: 'Your account has been created successfully.',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen mobile-container mobile-padding">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pt-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isLogin ? 'Welcome Back' : 'Join DigiBaryo'}
        </h1>
      </div>

      {/* Form Container */}
      <div className="glass-elevated rounded-3xl p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Enter your credentials to access the community platform' 
              : 'Join your barangay community and stay connected'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              required
              className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
              className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
            />
          </div>

          {/* Signup only fields */}
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Juan dela Cruz"
                  required
                  className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barangay" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Barangay
                </Label>
                <Input
                  id="barangay"
                  type="text"
                  value={formData.barangay}
                  onChange={(e) => handleInputChange('barangay', e.target.value)}
                  placeholder="Barangay San Antonio"
                  required
                  className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+63 912 345 6789"
                  required
                  className="rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            variant="gradient" 
            size="lg"
            disabled={isLoading}
            className="w-full rounded-xl mt-6"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
      </div>

      {/* Switch between login/signup */}
      <div className="text-center">
        <p className="text-muted-foreground mb-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsLogin(!isLogin)}
          className="rounded-xl"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </Button>
      </div>
    </div>
  );
};