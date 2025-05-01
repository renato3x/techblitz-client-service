import { Bell, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Navbar() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
      return;
    }

    setTheme('light');
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
                <AvatarImage src="https://github.com/renato3x.png" alt="User"/>
                <AvatarFallback>RP</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem asChild className="hover:cursor-pointer">
                <Link to="/settings">
                  <Settings/> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer">
                <LogOut/> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
