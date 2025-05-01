import { createBrowserRouter } from 'react-router-dom';
import { SignIn } from './pages/signin';
import { SignUp } from './pages/signup';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'signup',
        element: <SignUp/>,
      },
      {
        path: 'signin',
        element: <SignIn/>,
      },
    ],
  },
]);
