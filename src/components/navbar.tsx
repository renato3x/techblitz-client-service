import { Bell, LogOut, Moon, SquarePen, Sun, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/auth';
import { User } from '@/types/user';
import { Button } from './ui/button';

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

  function getAvatarFallback() {
    const names = user!.name.trim().split(' ');

    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }

    const first = names[0][0].toUpperCase();
    const last = names.at(-1)![0].toUpperCase();
    return `${first}${last}`;
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
            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
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
  return (
    <>
      <Button asChild>
        <Link to="/signup">Sign up</Link>
      </Button>
      <Button asChild variant="ghost">
        <Link to="/signin">Sign in</Link>
      </Button>
    </>
  );
}
