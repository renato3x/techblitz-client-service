import { Navbar } from '@/components/navbar';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}
