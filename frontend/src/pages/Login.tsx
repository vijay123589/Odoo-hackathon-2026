import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-2xl relative overflow-hidden border border-border">
        {/* Subtle top primary accent line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-white font-bold text-2xl mb-2 shadow-lg shadow-primary/20">
            🌱
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to EcoSphere
          </CardTitle>
          <CardDescription>
            Enter your enterprise credentials to access your ESG portal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-500/20">
                {error}
              </div>
            )}
            
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. admin@ecosphere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
