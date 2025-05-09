import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import { ResourceNotFound } from './pages/resource-not-found';
import { AppLayout } from './layouts/app';
import { Home } from './pages/home';
import { ProtectedRoute } from './components/protected-route';
import { useEffect } from 'react';
import { authService } from './services/auth';
import { Toaster } from 'sonner';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import { UserProfile } from './pages/user-profile';
import { Settings } from './pages/settings';
import { Profile } from './pages/settings/profile';
import { Authentication } from './pages/settings/authentication';
import { useQuery } from '@tanstack/react-query';
import { ForgotPassword } from './pages/forgot-password';

export function App() {
  const { theme } = useTheme();
  const { isLoading } = useQuery({
    queryKey: ['validate-auth'],
    queryFn: () => authService.validate(),
  });

  useEffect(() => {
    authService.validate();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider>
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<AppLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="/settings" element={<Settings/>}>
              <Route path="profile" index element={<Profile/>}/>
              <Route path="authentication" index element={<Authentication/>}/>
            </Route>
          </Route>
        </Route>
        <Route path="/:username" element={<AppLayout/>}>
          <Route index element={<UserProfile/>}/>
        </Route>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="*" element={<ResourceNotFound/>}/>
      </Routes>
      <Toaster
        theme={theme}
        duration={7000}
        closeButton
        icons={{
          info: <Info className="w-4.5 h-4.5"/>,
          success: <CircleCheck className="w-4.5 h-4.5"/>,
          error: <CircleX className="w-4.5 h-4.5"/>,
        }}
      />
    </ThemeProvider>
  );
}
