import { useState } from "react";
import DefaultLayout from "../layout/defaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import Swal from "sweetalert2";
import "../App.css";
import UserDataForm from "../components/UserDataForm";

export default function Signup() {
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    username: string,
    password: string,
    name: string
  ) => {
    
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
        setErrorMessage("");
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Usuario creado satisfactoriamente",
        });
        navigate("/"); // Redirige al usuario al inicio de sesión
      } else {
        const json = (await response.json()) as AuthResponseError;
        console.log("Algo salió mal:", json.body.error);
        setErrorMessage(json.body.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            json.body.error === "User already exists"
              ? "El usuario ya existe"
              : "No se pudo registrar. Inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Error inesperado");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar. Inténtalo de nuevo más tarde.",
      });
    } 
  };

  if (auth.isAuthenticated) {
    return <Navigate to="/profile" />;
  }

  return (
    <DefaultLayout>
      <UserDataForm
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
      />
    </DefaultLayout>
  );
}
