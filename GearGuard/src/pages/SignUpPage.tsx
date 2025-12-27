import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    // Step 1: Account info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2: Personal info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    // Step 3: Technician details
    const [department, setDepartment] = useState('');
    const [experience, setExperience] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [bio, setBio] = useState('');

    const handleStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setStep(2);
    };

    const handleStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!firstName.trim() || !lastName.trim()) {
            setError('First and last name are required');
            return;
        }
        setStep(3);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!department) {
            setError('Please select your department');
            return;
        }
        if (!experience) {
            setError('Please select your experience level');
            return;
        }

        setLoading(true);

        try {
            console.log('Starting signup...', { email, firstName, lastName, department });

            // Sign up with Supabase Auth - include department in metadata
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        department: department,
                        phone: phone || null,
                    },
                },
            });

            console.log('Signup response:', { data, error: signUpError });

            if (signUpError) throw signUpError;

            if (!data.user) {
                throw new Error('No user returned from signup');
            }

            // Profile is created by the handle_new_user trigger
            // The trigger reads from raw_user_meta_data, so we already passed the info above

            setSuccess(true);
            toast.success('Account created successfully!');
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <Card className="w-full max-w-md border-0 shadow-xl">
                    <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Check your email</h2>
                        <p className="text-muted-foreground">
                            We've sent a confirmation link to <strong>{email}</strong>
                        </p>
                        <Button onClick={() => navigate('/login')} className="mt-4">
                            Back to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-lg border-0 shadow-xl">
                <CardHeader className="space-y-4 pb-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                        <Wrench className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Join as Technician</CardTitle>
                        <CardDescription className="mt-2">
                            Create your technician account to get started
                        </CardDescription>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${s === step
                                    ? 'bg-primary text-primary-foreground'
                                    : s < step
                                        ? 'bg-green-500 text-white'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {s < step ? '✓' : s}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Step {step} of 3: {step === 1 ? 'Account' : step === 2 ? 'Personal Info' : 'Technician Details'}
                    </p>
                </CardHeader>

                {error && (
                    <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {/* Step 1: Account */}
                {step === 1 && (
                    <form onSubmit={handleStep1}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="h-11 w-full">
                                Continue
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                    <form onSubmit={handleStep2}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">
                                Back
                            </Button>
                            <Button type="submit" className="flex-1 h-11">
                                Continue
                            </Button>
                        </CardFooter>
                    </form>
                )}

                {/* Step 3: Technician Details */}
                {step === 3 && (
                    <form onSubmit={handleFinalSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Department *</Label>
                                <Select value={department} onValueChange={setDepartment}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select your department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Production">Production</SelectItem>
                                        <SelectItem value="Assembly">Assembly</SelectItem>
                                        <SelectItem value="Quality Control">Quality Control</SelectItem>
                                        <SelectItem value="Packaging">Packaging</SelectItem>
                                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                                        <SelectItem value="Facilities">Facilities</SelectItem>
                                        <SelectItem value="IT">IT</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Experience Level *</Label>
                                <Select value={experience} onValueChange={setExperience}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entry">Entry Level (0-1 years)</SelectItem>
                                        <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                                        <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
                                        <SelectItem value="senior">Senior (5-10 years)</SelectItem>
                                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input
                                    id="specialization"
                                    placeholder="e.g. CNC Machines, HVAC, Electrical..."
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">About You</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Brief description of your skills and experience..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">
                                Back
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1 h-11">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}
