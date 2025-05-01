import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from './theme-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
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
    <header className="border-b border-dashed">
      <nav className="flex items-center justify-between p-4">
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
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
