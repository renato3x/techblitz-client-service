import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { notifier } from '@/utils/notifier';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string({ message: 'Email is required.' }).email({ message: 'Email is required.' }),
});

export function ForgotPassword() {
  const { recoveryEmailExpiryDateInMillis, setRecoveryEmailExpiryDateInMillis } = useAuthStore();
  const [expiresAt, setExpiresAt] = useState<DateTime | null>(null);
  const [remaining, setRemaining] = useState<string>('');
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (recoveryEmailExpiryDateInMillis !== null && recoveryEmailExpiryDateInMillis > 0) {
      setExpiresAt(DateTime.fromMillis(recoveryEmailExpiryDateInMillis));
      setIsCounting(true);
      return;
    }

    setExpiresAt(null);
    setIsCounting(false);
  }, [recoveryEmailExpiryDateInMillis]);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const updateRemainingTime = () => {
      const now = DateTime.local();
      const diff = expiresAt.diff(now, ['minutes', 'seconds']);

      if (diff.as('milliseconds') <= 0) {
        setRecoveryEmailExpiryDateInMillis(null);
        return;
      }

      const { minutes, seconds } = diff.toObject();
      const m = String(Math.floor(minutes!)).padStart(2, '0');
      const s = String(Math.floor(seconds!)).padStart(2, '0');
      setRemaining(`${m}:${s}`);
    };

    updateRemainingTime();
    const timer = setInterval(() => {
      updateRemainingTime();
      const [m, s] = remaining.split(':').map(Number);
      if (m <= 0 && s <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [expiresAt, remaining, setRecoveryEmailExpiryDateInMillis]);

  async function startAccountRecoveryProcess({ email }: z.infer<typeof formSchema>) {
    const { expiration_date_in_millis } = await authService.forgotPassword(email);
    setRecoveryEmailExpiryDateInMillis(expiration_date_in_millis);
    notifier.info('Recovery email sent', `Check ${email} for instructions`);
  }

  return (
    <main className="px-5 md:px-0 h-screen flex justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>
              Recover your Techblitz account
            </span>

            <Link to="/signin" className="link flex items-center gap-1">
              Sign in
            </Link>
          </CardTitle>
          <CardDescription>Start your account recovery process safely.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex items-end gap-3" onSubmit={form.handleSubmit(startAccountRecoveryProcess)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Email" type="email" disabled={isCounting}/>
                    </FormControl>
                    <FormMessage className="text-xs"/>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={!form.formState.isValid || isCounting}>
                {isCounting && remaining ? `Resend in ${remaining}` : (
                  <>
                    Continue <ChevronRight/>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
