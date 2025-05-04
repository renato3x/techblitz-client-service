import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { UserRoundCog } from 'lucide-react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

export function Settings() {
  const { pathname } = useLocation();

  if (pathname === '/settings') {
    return <Navigate to="/settings/profile"/>;
  }

  const menu = [
    {
      to: '/settings/profile',
      title: 'Profile',
      icon: <UserRoundCog/>,
    },
  ];

  return (
    <Container className="grid grid-rows-1 grid-cols-[auto_1fr]">
      <aside className="border-x w-70">
        <div className="p-5 border-b">
          <h2 className="text-lg font-bold">Settings</h2>
          <span className="text-sm text-muted-foreground">Update your personal info and privacy settings.</span>
        </div>
        <nav className="flex flex-col gap-2 p-5">
          {menu.map((item, index) => (
            <Button
              asChild
              key={index}
              variant={pathname === item.to ? 'secondary' : 'ghost'}
              className="justify-start"
            >
              <Link to={item.to}>
                {item.icon} {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>
     <section className="border-r p-5">
        <Outlet/>
     </section>
    </Container>
  );
}
