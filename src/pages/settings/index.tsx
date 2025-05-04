import { Container } from '@/components/container';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function Settings() {
  const { pathname } = useLocation();

  if (pathname === '/settings') {
    return <Navigate to="/settings/profile"/>;
  }

  return (
    <Container>
      <Outlet/>
    </Container>
  );
}
