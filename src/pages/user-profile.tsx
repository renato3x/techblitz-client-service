import { Container } from '@/components/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types/user';
import { notifier } from '@/utils/notifier';
import { EllipsisVertical, Pencil, Share2, UserLock } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth';
import { NotFound } from '@/components/not-found';
import { useAppStore } from '@/store/app';

type UserProfileParams = {
  username: string;
}

async function searchUser(username: string) {
  const { data: response } = await api.get<ApiResponse<User>>(`users/${username}`);
  return response.data;
}

export function UserProfile() {
  const params = useParams<UserProfileParams>();
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user-profile', params.username],
    enabled: !!params.username,
    queryFn: () => searchUser(params.username as string),
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) {
    return <UserProfileSkeleton/>;
  }

  if (isError || !user) {
    return (
      <Container className="flex flex-col justify-center items-center px-4">
        <NotFound/>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col">
      <header className="flex p-4 justify-between gap-2">
        <div className="flex gap-4 grow">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className='text-3xl bg-primary'>{user.avatar_fallback}</AvatarFallback>
          </Avatar>
          <div className="grow">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 text-sm text-justify">{user.bio}</p>}
            <div className="hidden md:flex gap-3 mt-1">
              <span>
                <strong>{user.total_followers}</strong> Followers
              </span>
              <span>
                <strong>{user.total_following}</strong> Following
              </span>
            </div>
            <div className="flex md:hidden mt-2 gap-2">
              <UserProfileAction user={user}/>
              <UserProfileDropdown user={user}/>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <UserProfileAction user={user}/>
          <UserProfileDropdown user={user}/>
        </div>
      </header>
      <Separator/>
      <UserProfileMobileFollowInfo user={user}/>
    </Container>
  );
}

function UserProfileDropdown({ user }: { user: User }) {
  const { isSignedIn, user: signedInUser } = useAuthStore();

  async function copyProfileUrl() {
    const url = `${import.meta.env.VITE_APP_URL}/${user!.username}`;
    await navigator.clipboard.writeText(url);
    notifier.info('Copied', 'Profile url copied to clipboard');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <EllipsisVertical/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="hover:cursor-pointer"onClick={copyProfileUrl}>
          <Share2/> Share
        </DropdownMenuItem>
        {isSignedIn && signedInUser?.id !== user.id && (
          <DropdownMenuItem className="hover:cursor-pointer">
            <UserLock/> Block
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserProfileMobileFollowInfo({ user }: { user: User }) {
  return (
    <>
      <section className="flex justify-around py-3 md:hidden">
        <div className="flex flex-col text-sm justify-center items-center">
          <span>
            <strong>Followers</strong>
          </span>
          <span>{user.total_followers}</span>
        </div>
        <div className="flex flex-col text-sm justify-center items-center">
          <span>
            <strong>Following</strong>
          </span>
          <span>{user.total_following}</span>
        </div>
      </section>
      <Separator className="flex md:hidden"/>
    </>
  );
}

function UserProfileAction({ user }: { user: User }) {
  const { isSignedIn, user: signedInUser } = useAuthStore();
  const { setRedirectUrl } = useAppStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function follow() {
    if (!isSignedIn) {
      setRedirectUrl(pathname);
      navigate('/signin');
      return;
    }
  }

  if (isSignedIn && signedInUser?.id === user.id) {
    return (
      <Button className="grow" asChild>
        <Link to="/settings/profile">
          <Pencil/>
          Edit profile
        </Link>
      </Button>
    );
  }

  return (
    <Button className="grow" onClick={follow}>Follow</Button>
  );
}

function UserProfileSkeleton() {
  return (
    <Container className="flex flex-col">
      <header className="flex p-4 justify-between gap-2">
        <div className="flex gap-4 grow">
          <Skeleton className="w-20 h-20 rounded-full"/>
          <div className="grow space-y-2">
            <Skeleton className="w-40 h-6"/>
            <Skeleton className="w-24 h-4"/>
            <Skeleton className="w-full h-12 mt-2"/>
            <div className="hidden md:flex gap-3 mt-1">
              <Skeleton className="w-20 h-4"/>
              <Skeleton className="w-20 h-4"/>
            </div>
            <div className="flex md:hidden mt-2 gap-2">
              <Skeleton className="h-10 w-full rounded-md"/>
              <Skeleton className="h-10 w-10 rounded-md"/>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md"/>
          <Skeleton className="h-10 w-10 rounded-md"/>
        </div>
      </header>
      <Separator/>
      <section className="flex justify-around py-3 md:hidden">
        <div className="flex flex-col text-sm justify-center items-center">
          <Skeleton className="w-16 h-4"/>
          <Skeleton className="w-10 h-4 mt-2"/>
        </div>
        <div className="flex flex-col text-sm justify-center items-center">
          <Skeleton className="w-16 h-4"/>
          <Skeleton className="w-10 h-4 mt-2"/>
        </div>
      </section>
      <Separator className="flex md:hidden"/>
    </Container>
  );
}
