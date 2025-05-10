import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQueryParams } from '@/hooks/query-params';
import { authService } from '@/services/auth';
import { isUUID } from '@/utils';
import { notifier } from '@/utils/notifier';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';

type QueryParams = {
  token: string;
};

const formSchema = z
  .object({
    password: z
      .string({ message: 'Enter the new password.' })
      .trim()
      .nonempty('Enter the new password.')
      .min(8, { message: 'Password must have at least 8 characters.' }),
    confirm_password: z
      .string({ message: 'Confirm your password.' })
      .trim()
      .nonempty('Confirm your password.')
      .min(8, { message: 'Password must have at least 8 characters.' }),
  })
  .refine((data) => data.confirm_password === data.password, {
    message: 'Passwords does not match.',
    path: ['confirm_password'],
  });

export function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useQueryParams<QueryParams>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const [password, confirmPassword] = useWatch({
    control: form.control,
    name: ['password', 'confirm_password'],
  });

  useEffect(() => {
    if (password && confirmPassword) {
      form.trigger('confirm_password');
    }
  }, [password, confirmPassword, form]);

  if (!token || !isUUID(token)) {
    return <Navigate to="/signin"/>;
  }

  async function resetPassword({ password }: z.infer<typeof formSchema>) {
    await authService.resetPassword({ password, token: token! });
    notifier.success('Password reset', 'Your password was reset successfully.');
    navigate('/');
  }

  return (
    <main className="px-5 md:px-0 h-screen flex justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Set a new password to your Techblitz account</CardTitle>
          <CardDescription>Create a strong new password to secure your Techblitz account and regain access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(resetPassword)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Password"/>
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
                      <PasswordInput {...field} placeholder="Confirm password"/>
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
      </Card>
    </main>
  );
}
