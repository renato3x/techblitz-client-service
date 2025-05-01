import { createBrowserRouter } from 'react-router-dom';
import { SignIn } from './pages/signin';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'signin',
        element: <SignIn/>,
      },
    ],
  },
]);
