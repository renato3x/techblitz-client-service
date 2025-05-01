import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import { NotFound } from './pages/not-found';
import { AppLayout } from './layouts/app';
import { Home } from './pages/home';
import { useAuthStore } from './store/auth';
import { ProtectedRoute } from './components/protected-route';
import { useEffect } from 'react';
import { authService } from './services/auth';

export function App() {
  const { isSignedIn } = useAuthStore();

  useEffect(() => {
    authService.validate();
  }, []);

  return (
    <ThemeProvider>
      <Routes>
        <Route element={<ProtectedRoute isSignedIn={isSignedIn}/>}>
          <Route path="/" element={<AppLayout/>}>
            <Route index element={<Home/>}/>
          </Route>
        </Route>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </ThemeProvider>
  );
}
