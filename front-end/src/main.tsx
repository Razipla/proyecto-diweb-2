//importaciones bibliotecas necesarias y componentes que forman parte de las rutas del appp
import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './routes/login.tsx';
import Signup from './routes/signup.tsx';
import Profile from "./routes/profile.tsx";
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SecureRoute from './routes/secureRoute.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';
import './Layout.css';
// componentes rutas
//Función crea un enrutador basado en rutas especificas 
//Se define un enrutador que especifica las rutas de la aplicación.
const router = createBrowserRouter ([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },  
  {
    path: "/",
    element: <SecureRoute/>,
    //SecureRoute actúa como una ruta protegida que contiene rutas hijas, como la ruta /profile.
    children: [
      {
        path: "/profile",
        element: <Profile/>,
      },
    ],
  },
]);
//La aplicación se renderiza dentro del elemento con el ID root.
//AuthProvider provee el contexto de autenticación para toda la aplicación.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router= {router} />
    </AuthProvider>
  </React.StrictMode>,
)
