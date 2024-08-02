import React, { useState } from "react";
import { API_URL } from "../auth/constants";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../App.css";

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El campo de búsqueda no puede estar vacío",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${searchTerm.trim()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        console.log("200: ", json);
        setUsers(json);
      } else {
        const json = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: json.message || "Error al buscar usuarios",
        });
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error inesperado al buscar usuarios",
      });
    }
  };

  const startChat = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="user-search">
      <h2>Buscar usuarios</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="user-list">
        {users.map((user: any, index) => (
          <div key={index} className="user-item">
            <span>{user.username}</span>
            <button onClick={() => startChat(user._id)}>Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
}
