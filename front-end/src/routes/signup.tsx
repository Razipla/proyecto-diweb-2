import { useState } from "react";
import DefaultLayout from "../layout/defaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import Swal from 'sweetalert2';
import "../App.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  async function validationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios y no pueden contener solo espacios en blanco',
      });
      return;
    }
    handleSubmit();
  };

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          name: name.trim(),
        }),
      });

      if (response.ok) {
        console.log("Usuario creado satisfactoriamente");
        setErrorResponse("");
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario creado satisfactoriamente',
        });
        navigate("/"); // Redirige al usuario al inicio de sesión
      } else {
        const json = await response.json() as AuthResponseError;
        console.log("Algo salió mal:", json.body.error);
        setErrorResponse(json.body.error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: json.body.error === 'User already exists' ? 'El usuario ya existe' : 'No se pudo registrar. Inténtalo de nuevo más tarde.',
        });
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorResponse("Error inesperado");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar. Inténtalo de nuevo más tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return (
    <DefaultLayout>
      <form className="form" onSubmit={validationSubmit}>
        <h1>Registro</h1>
        {errorResponse && <div className="errorMessage">{errorResponse}</div>}

        <label>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Nombre de usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creando usuario..." : "Crear usuario"}
        </button>
      </form>
    </DefaultLayout>
  );
}