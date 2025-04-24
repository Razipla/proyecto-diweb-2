import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../auth/constants";
import "../Layout.css";

//Muestra un formulario para que los usuarios se registren.
//Maneja la lógica de envío del formulario y la comunicación con el servidor.
export default function PortalLayout({
    children
}: {
    children:React.ReactNode
}) {
    const auth = useAuth();
    async function handleSignOut(e: React.MouseEvent <HTMLAnchorElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/signout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer${auth.getRefreshToken()}`,
                }
            })
            if (response.ok) {
                auth.signOut();
                
            }
        } catch (error) {
            
        }
        
    }
    return (
        <div className="layout-container">
          <header className="header">
            <nav className="nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/me" className="nav-link">{auth.getUser()?.username ?? "User"}</Link>
                </li>
                <li className="nav-item">
                  <a href="#" onClick={handleSignOut} className="nav-link">Sign Out</a>
                </li>
              </ul>
            </nav>
          </header>
          <main className="main-content">{children}</main>
        </div>
      );
    }