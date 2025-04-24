//Valida que si el usuario esta autentificado muestre el contenido de lo contrario lo redirija a una pública
//react hooks para placeholder y navegar
//import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../App.css" 
export default function SecureRoute() {
    const auth =  useAuth()
    //const [isAuth, setIsAuth] = useState(false);
    return auth.isAuthenticated ? <Outlet /> : <Navigate to = "/" />;
    
}