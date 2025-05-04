import { Navbar } from '@/components/navbar';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="grow flex">
        <Outlet/>
      </main>
    </div>
  );
}
