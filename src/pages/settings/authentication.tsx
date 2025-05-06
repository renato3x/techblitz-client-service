import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authService } from '@/services/auth';
import { notifier } from '@/utils/notifier';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    old_password: z
      .string({ message: 'Enter current password.' })
      .trim()
      .nonempty('Enter current password.')
      .min(8, { message: 'Current password must have at least 8 characters.' }),
    new_password: z
      .string({ message: 'Enter new password.' })
      .trim()
      .nonempty('Enter new password.')
      .min(8, { message: 'New password must have at least 8 characters.' }),
    confirm_password: z
      .string({ message: 'Enter new password.' })
      .trim()
      .nonempty('Enter new password.')
      .min(8, { message: 'New password must have at least 8 characters.' }),
  })
  .refine((data) => data.old_password !== data.new_password, {
    message: 'New password must be different from current password.',
    path: ['new_password'],
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'New password does not match.',
    path: ['confirm_password'],
  });

type FormSchema = z.infer<typeof formSchema>;

export function Authentication() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const [oldPassword, newPassword, confirmPassword] = useWatch({
    control: form.control,
    name: ['old_password', 'new_password', 'confirm_password'],
  });

  useEffect(() => {
    if (oldPassword && newPassword) {
      form.trigger('new_password');
    }
  }, [oldPassword, newPassword, form]);

  useEffect(() => {
    if (confirmPassword && newPassword) {
      form.trigger('confirm_password');
    }
  }, [confirmPassword, newPassword, form]);

  async function changePassword({ old_password, new_password }: FormSchema) {
    await authService.changePassword({ old_password, new_password });
    notifier.success('Password changed', 'Password changed successfully.');
  }

  return (
    <div className="min-h-full max-h-full px-[150px]">
      <Form {...form}>
        <form className="space-y-4 w-[500px]" onSubmit={form.handleSubmit(changePassword)}>
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="Current password"/>
                </FormControl>
                <FormMessage className="text-xs"/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="New password"/>
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
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
