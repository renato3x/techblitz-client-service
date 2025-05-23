import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { useAppStore } from '@/store/app';
import { PasswordInput } from '@/components/password-input';

const formSchema = z.object({
  usernameOrEmail: z
    .string({ message: 'Type your email or username.' })
    .trim()
    .nonempty('Type your email or username.'),
  password: z
    .string({ message: 'Password is required.' })
    .trim()
    .nonempty('Password is required.')
    .min(8, { message: 'Password must have at least 8 characters.' }),
});

export function SignIn() {
  const { redirectUrl, setRedirectUrl } = useAppStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  async function login(credentials: z.infer<typeof formSchema>) {
    await authService.signin(credentials);
    navigate(redirectUrl ? redirectUrl : '/');
    setRedirectUrl('');
  }

  return (
    <main className="px-5 md:px-0 h-screen flex justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Sign in to Techblitz</CardTitle>
          <CardDescription>Access your account from Techblitz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(login)}>
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Username or email"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Password"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <p className="text-right">
                <Link to="/forgot-password" className="link">
                  Forgot password
                </Link>
              </p>

              <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                Continue
                <ChevronRight/>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="w-full text-center">
            Don't you have an account?{' '}
            <Link to="/signup" className="link">
              Sign up
            </Link>.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
