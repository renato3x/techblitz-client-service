import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import { NotFound } from './pages/not-found';
import { AppLayout } from './layouts/app';
import { Home } from './pages/home';
import { ProtectedRoute } from './components/protected-route';
import { useEffect } from 'react';
import { authService } from './services/auth';
import { Toaster } from 'sonner';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuthStore } from './store/auth';

export function App() {
  const { theme } = useTheme();
  const { isLoading } = useAuthStore();

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
          </Route>
        </Route>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Toaster
        theme={theme}
        duration={7000}
        closeButton
        icons={{
          info: <Info className="w-5 h-5"/>,
          success: <CheckCircle className="w-5 h-5"/>,
          error: <AlertTriangle className="w-5 h-5"/>,
        }}
      />
    </ThemeProvider>
  );
}
