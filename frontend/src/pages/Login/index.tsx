import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ecosphere.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try admin@ecosphere.com.');
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4] dark:bg-[#0D100E] px-4 relative overflow-hidden">
      {/* Background ambient lighting/shapes for organic premium feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/3 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/3 filter blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="shadow-[0_24px_60px_-15px_rgba(28,38,30,0.05)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-border/40 p-3 pt-6 bg-card relative">
          {/* Accent thin line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-primary/20 rounded-full" />
          
          <div className="flex flex-col items-center pt-6 pb-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/8 text-primary font-bold text-xl mb-4 border border-primary/5 shadow-[0_4px_16px_-4px_rgba(26,59,43,0.1)]">
              <Leaf className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground/90">
              Welcome to EcoSphere
            </h2>
            <p className="text-xs text-muted-foreground/80 mt-1.5 text-center px-6">
              Enter your enterprise credentials to access the ESG Command Center
            </p>
          </div>
          
          <CardContent className="p-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-xl bg-red-500/8 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-500/10 text-center"
                >
                  {error}
                </motion.div>
              )}
              
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. admin@ecosphere.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-full mt-4 h-11"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Soft Footer Credit */}
        <p className="text-center text-[10px] text-muted-foreground/50 tracking-wider font-semibold uppercase mt-6 select-none">
          Powered by EcoSphere ESG Architecture
        </p>
      </motion.div>
    </div>
  );
};
export default Login;
