import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Link, useNavigate } from 'react-router-dom';
import { isEmail } from '@/utils';
import { authService } from '@/services/auth';
import { useAppStore } from '@/store/app';

const formSchema = z
  .object({
    name: z
      .string({ message: 'Name is required.' })
      .trim()
      .nonempty('Name is required.')
      .max(50, 'Name is too long.')
      .regex(/^[^0-9]*$/, { message: 'Name cannot contain numbers.' }),
    password: z
      .string({ message: 'Password is required.' })
      .trim()
      .nonempty('Password is required.')
      .min(8, { message: 'Password must have at least 8 characters.' }),
    confirm_password: z
      .string({ message: 'Password is required.' })
      .trim()
      .nonempty('Password is required.')
      .min(8, { message: 'Password must have at least 8 characters.' }),
    username: z
      .string({ message: 'Username is required.' })
      .trim()
      .nonempty('Username is required.')
      .refine((val) => !/^\d+$/.test(val), {
        message: 'Username cannot consist of only numbers.',
      })
      .refine((val) => /^[a-zA-Z0-9._]+$/.test(val), {
        message: 'Username can only contain letters, numbers, dots, and underscores.',
      })
      .refine((val) => !/\.\./.test(val), {
        message: 'Username cannot contain consecutive dots.',
      })
      .refine((val) => !/^[.]+$/.test(val), {
        message: 'Username cannot consist of only dots.',
      })
      .refine((val) => !/^_+$/.test(val), {
        message: 'Username cannot consist of only underscores.',
      }),
    email: z.string({ message: 'Email is required' }).email({ message: 'Email is required' }),
  })
  .refine((data) => data.confirm_password === data.password, {
    message: 'Password does not match.',
    path: ['confirm_password'],
  });

type UsernameEmailValidationResponse = {
  valid: boolean;
  field: string;
  value: string;
}

export function SignUp() {
  const { redirectUrl, setRedirectUrl } = useAppStore();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const [username, email, password, confirmPassword] = useWatch({
    control: form.control,
    name: ['username', 'email', 'password', 'confirm_password'],
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        return;
      }

      const { data: response } = await api.get<ApiResponse<UsernameEmailValidationResponse>>('auth/check', {
        params: {
          field: 'username',
          value: username,
        },
      });

      if (!response.data.valid) {
        form.setError('username', {
          message: 'Username is no longer available.',
        });

        return;
      }

      form.clearErrors('username');
    };

    const id = setTimeout(checkUsername, 200);

    return () => {
      clearTimeout(id);
    };
  }, [username, form]);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !isEmail(email)) {
        return;
      }

      const { data: response } = await api.get<ApiResponse<UsernameEmailValidationResponse>>('auth/check', {
        params: {
          field: 'email',
          value: email,
        },
      });

      if (!response.data.valid) {
        form.setError('email', {
          message: 'Email is no longer available.',
        });

        return;
      }

      form.clearErrors('email');
    };

    const id = setTimeout(checkEmail, 200);

    return () => {
      clearTimeout(id);
    };
  }, [email, form]);

  useEffect(() => {
    if (password && confirmPassword) {
      form.trigger('confirm_password');
    }
  }, [password, confirmPassword, form]);

  async function register({ confirm_password: _, ...credentials }: z.infer<typeof formSchema>) {
    await authService.signup(credentials);
    navigate(redirectUrl ? redirectUrl : '/');
    setRedirectUrl('');
  }

  return (
    <main className="px-5 md:px-0 h-screen flex justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Sign up to Techblitz</CardTitle>
          <CardDescription>Join the best technology community in the world!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(register)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Name"/>
                      </FormControl>
                      <FormMessage className="text-xs"/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Username"/>
                      </FormControl>
                      <FormMessage className="text-xs"/>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" type="email"/>
                    </FormControl>
                    <FormMessage className="text-xs"/>
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
                    <FormMessage className="text-xs"/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Password" type="password"/>
                    </FormControl>
                    <FormMessage className="text-xs"/>
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
            Already have an account?{' '}
            <Link to={'/signin'} className="link">
              Sign in
            </Link>.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
