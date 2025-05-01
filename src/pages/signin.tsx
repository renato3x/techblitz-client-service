import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  return (
    <main className="px-5 md:px-0 h-screen flex justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Sign in to Techblitz</CardTitle>
          <CardDescription>Access your account from Techblitz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-3">
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
                      <Input {...field} placeholder="Password" type="password"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

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
            <Link to={'/signup'}>
              Sign up
            </Link>.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
