import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';
import { NotFound } from './pages/not-found';
import { AppLayout } from './layouts/app';
import { Home } from './pages/home';

export function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<AppLayout/>}>
          <Route index element={<Home/>}/>
        </Route>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </ThemeProvider>
  );
}
