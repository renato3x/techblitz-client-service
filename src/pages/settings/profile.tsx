import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/axios';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { ApiErrorResponse, ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { isEmail } from '@/utils';
import { notifier } from '@/utils/notifier';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Pencil } from 'lucide-react';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string({ message: 'Email is required' }).email({ message: 'Email is required' }).transform((value) => value?.trim()),
  name: z
    .string({ message: 'Name is required.' })
    .trim()
    .nonempty('Name is required.')
    .max(50, 'Name is too long.')
    .regex(/^[^0-9]*$/, { message: 'Name cannot contain numbers.' })
    .transform((value) => value?.trim()),
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
    })
    .transform((value) => value?.trim()),
  bio: z.string().trim().optional().transform((value) => value?.trim()),
});

type UsernameEmailValidationResponse = {
  valid: boolean;
  field: string;
  value: string;
}

export function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-full max-h-full flex flex-col justify-center items-center">
      <ProfileAvatar user={user as User}/>
      <ProfileData user={user as User}/>
    </div>
  );
}

function ProfileData({ user }: { user: User }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
    },
  });

  const username = form.watch('username');
  const email = form.watch('email');

  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username === user?.username) {
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
  }, [username, form, user]);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !isEmail(email) || email === user?.email) {
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
  }, [email, form, user]);

  async function update(credentials: z.infer<typeof formSchema>) {
    try {
      await authService.update(credentials);
      notifier.success('Data updated', 'Your account\'s data was updated successfully.');
    } catch (error) {
      if (!isAxiosError<ApiErrorResponse>(error)) {
        notifier.defaultError();
        return;
      }

      if (error.status === 401) {
        await authService.signout();
        notifier.error('Sessions expired', 'Your current session has expired. Sign in again.');
        return;
      }

      const response = error.response!.data;

      if (response.errors) {
        notifier.error(response.error, response.errors[0]);
        return;
      }

      notifier.error(response.error, response.message);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4 w-[500px]" onSubmit={form.handleSubmit(update)}>
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[200px]"/>
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
  );
}

function ProfileAvatar({ user }: { user: User }) {
  const avatarInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  async function updateAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = Array.from(event.target.files as FileList)[0];

    if (!file) {
      return;
    }

    try {
      await authService.updateAvatar(file);
      notifier.success('Avatar updated', 'Your avatar was updated successfully.');
    } catch (error) {
      if (!isAxiosError<ApiErrorResponse>(error)) {
        notifier.defaultError();
        return;
      }

      if (error.status === 401) {
        await authService.signout();
        notifier.error('Sessions expired', 'Your current session has expired. Sign in again.');
        return;
      }

      const response = error.response!.data;

      if (response.errors) {
        notifier.error(response.error, response.errors[0]);
        return;
      }

      notifier.error(response.error, response.message);
    }
  }

  return (
    <>
      <input
        id="avatar-input"
        className="hidden"
        type="file"
        ref={avatarInputRef}
        accept={import.meta.env.VITE_ACCEPTED_IMAGE_EXTENSIONS}
        onChange={updateAvatar}
      />
      <div className="flex justify-center items-center p-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-20 h-20 hover:cursor-pointer">
              <AvatarImage src={user?.avatar_url} alt={user?.username}/>
              <AvatarFallback className="text-3xl bg-primary text-foreground">{user?.avatar_fallback}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => avatarInputRef.current.click()}>
              <Pencil/> Change avatar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
