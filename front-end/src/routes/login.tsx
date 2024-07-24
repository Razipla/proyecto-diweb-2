import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import DefaultLayout from "../layout/defaultLayout";
import { useState } from "react";
import { API_URL } from "../auth/constants";
import type { AuthResponse, AuthResponseError } from "../types/types";
import "../App.css";
import Swal from 'sweetalert2';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  async function validationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios y no pueden contener solo espacios en blanco',
      });
      return;
    }
    handleSubmit(e);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        console.log("Usuario ingresado satisfactoriamente");
        setErrorResponse("");
        const json = await response.json();
        console.log(json);

        if (json.accessToken && json.refreshToken) {
          auth.saveUser({ body: json } as AuthResponse);
          navigate("profile");
        }
      } else {
        const json = await response.json() as AuthResponseError;
        console.log("Something went wrong:", json);
        setErrorResponse(json.body.error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: json.body.error || 'No se pudo iniciar sesión. Verifica tu nombre de usuario y contraseña.',
        });
      }
    } catch (error) {
      console.log("Error al enviar la solicitud", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo iniciar sesión. Verifica tu nombre de usuario y contraseña.',
      });
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return (
    <DefaultLayout>
      <form className="form" onSubmit={validationSubmit}>
        <h1>Login</h1>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}

        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button>Login</button>
      </form>
    </DefaultLayout>
  );
}