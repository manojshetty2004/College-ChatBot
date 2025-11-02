import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import PasswordStrength from '@/components/PasswordStrength';
import { UserRole } from '@/types';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  studentId: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'faculty', 'staff']),
});

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    try {
      signupSchema.parse({ name, email, studentId, password, role });
      setIsLoading(true);

      const { error } = await signUp(email, password, name, studentId, role);

      if (error) {
        toast({
          title: 'Registration Failed',
          description: error.message || 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: 'Account created successfully. Please check your email to verify your account.',
        });
        navigate('/login');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Register for your DBIT Chat Bot account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@dbit.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student/Employee ID (Optional)</Label>
                <Input
                  id="studentId"
                  placeholder="DBIT12345"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordStrength password={password} />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="text-sm cursor-pointer leading-none">
                    I agree to the{' '}
                    <Dialog open={showTerms} onOpenChange={setShowTerms}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Terms and Conditions
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Terms and Conditions</DialogTitle>
                          <DialogDescription>
                            Please read these terms carefully before using DBIT Chat Bot
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <h3 className="font-semibold">1. Acceptance of Terms</h3>
                          <p className="text-muted-foreground">
                            By accessing and using DBIT Chat Bot, you accept and agree to be bound by the terms
                            and provision of this agreement.
                          </p>
                          
                          <h3 className="font-semibold">2. Use License</h3>
                          <p className="text-muted-foreground">
                            Permission is granted to temporarily access DBIT Chat Bot for personal, non-commercial
                            use only. This is the grant of a license, not a transfer of title.
                          </p>

                          <h3 className="font-semibold">3. User Conduct</h3>
                          <p className="text-muted-foreground">
                            You agree to use the service responsibly and not to abuse, harass, threaten, or
                            otherwise violate the rights of any other users or the institution.
                          </p>

                          <h3 className="font-semibold">4. Privacy</h3>
                          <p className="text-muted-foreground">
                            Your use of DBIT Chat Bot is also governed by our Privacy Policy. We collect and
                            use information in accordance with that policy.
                          </p>

                          <h3 className="font-semibold">5. Modifications</h3>
                          <p className="text-muted-foreground">
                            DBIT may revise these terms of service at any time without notice. By using this
                            service you are agreeing to be bound by the current version of these terms.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;
