import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './routes/login';
import Signup from './routes/signup';
import Profile from "./routes/profile";
import UpdateProfile from './routes/updateProfile';
import UserSearch from './routes/userSearch';
import Chat from './routes/chat';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SecureRoute from './routes/secureRoute';
import { AuthProvider } from './auth/AuthProvider';
import './Layout.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/update-profile",
    element: <UpdateProfile />,
  },
  {
    path: "/",
    element: <SecureRoute />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/chat",
        element: <UserSearch />,
      },
      {
        path: "/chat/:userId/:roomId",
        element: <Chat />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);