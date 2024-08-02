import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../auth/constants";
import "../Layout.css";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  async function handleSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const refreshToken = auth.getRefreshToken();
    console.log("Token de actualización para signOut:", refreshToken); // Log para verificar el token
    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        }
      });
      if (response.ok) {
        auth.signOut();
      } else {
        console.error("Error al cerrar sesión:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
              <Link to="/update-profile" className="nav-link">{auth.getUser()?.username ?? "User"}</Link>
            </li>
            <li className="nav-item">
              <Link to="/chat" className="nav-link">Chat</Link>
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