import { Bell, LogOut, Moon, Settings, SquarePen, Sun, User as UserIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/auth';
import { User } from '@/types/user';
import { Button } from './ui/button';
import { useAppStore } from '@/store/app';

export function Navbar() {
  const { user, isSignedIn } = useAuthStore();

  return (
    <header className="border-b">
      <nav className="flex items-center justify-between p-3">
        <Link to="/" className="text-xl font-bold">Techblitz</Link>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <SignedInMenu user={user as User}/>
          ) : (
            <SignedOutMenu/>
          )}
        </div>
      </nav>
    </header>
  );
}

function SignedInMenu({ user }: { user: User }) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
      return;
    }

    setTheme('light');
  }

  async function logout() {
    await authService.signout();
    navigate('/signin');
  }

  return (
    <>
      <Button variant="ghost">
        <SquarePen/>
      </Button>
      <Button variant="ghost">
        <Bell/>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="hover:cursor-pointer">
            <AvatarImage src={user?.avatar_url} alt={user.name}/>
            <AvatarFallback>{user.avatar_fallback}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to={`/${user.username}`}>
              <UserIcon/> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/settings">
              <Settings/> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={toggleTheme}>
            {theme === 'light' ? <Sun/> : <Moon/>} Theme
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={logout}>
            <LogOut/> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function SignedOutMenu() {
  const { setRedirectUrl } = useAppStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function go(to: string) {
    setRedirectUrl(pathname);
    navigate(to);
  }

  return (
    <>
      <Button onClick={() => go('/signup')}>
        Sign up
      </Button>
      <Button variant="ghost" onClick={() => go('/signin')}>
        Sign in
      </Button>
    </>
  );
}
