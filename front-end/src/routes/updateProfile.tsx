import { useState } from "react";
import DefaultLayout from "../layout/defaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
import Swal from "sweetalert2";
import "../App.css";
import UserDataForm from "../components/UserDataForm";

const UpdateProfile = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (
    username: string,
    password: string,
    name: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          name: name.trim(),
        }),
      });

      if (response.ok) {
        console.log("Usuario actualizado satisfactoriamente");
        setErrorMessage("");
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Usuario actualizado satisfactoriamente",
        });
        // TODO: poner ruta real
        navigate("/"); // Redirige al usuario al inicio de sesión
      } else {
        const json = (await response.json()) as AuthResponseError;
        console.log("Algo salió mal:", json.body.error);
        setErrorMessage(json.body.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo registrar. Inténtalo de nuevo más tarde.",
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

  console.log(auth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <DefaultLayout>
      <UserDataForm errorMessage={errorMessage} onSubmit={handleSubmit} />
    </DefaultLayout>
  );
};

export default UpdateProfile;
