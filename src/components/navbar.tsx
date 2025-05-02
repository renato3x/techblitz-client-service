import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/auth';

export function Navbar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();

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
    await authService.logout();
    navigate('/signin');
  }

  return (
    <header className="border-b">
      <nav className="flex items-center justify-between p-3">
        <Link to="/" className="text-xl font-bold">Techblitz</Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Sun/> : <Moon/>}
          </Button>

          <Button variant="ghost" size="icon">
            <Bell/>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="hover:cursor-pointer">
                <AvatarImage src={user?.avatar_url} alt={user?.name}/>
                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={logout}>
                <LogOut/> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
