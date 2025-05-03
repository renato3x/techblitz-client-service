import { useAuthStore } from '@/store/auth';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { isSignedIn } = useAuthStore();

  return isSignedIn ? <Outlet/> : <Navigate to="/signin" replace/>;
}
