import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  isSignedIn: boolean;
}

export function ProtectedRoute({ isSignedIn }: ProtectedRouteProps) {
  return isSignedIn ? <Outlet/> : <Navigate to="/signin" replace/>;
}
