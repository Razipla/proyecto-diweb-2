import React, { useState, useEffect } from "react";
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
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Función para cargar datos del usuario
    const loadUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
        });
        
        if (response.ok) {
          const json = await response.json();
          setUsername(json.username);
          setName(json.name);
        } else {
          const json = await response.json() as AuthResponseError;
          setErrorMessage(json.body.error);
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        setErrorMessage("Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [auth]);

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
        setErrorMessage("");
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Usuario actualizado satisfactoriamente",
        });
        navigate("/"); // Redirige al usuario al perfil después de la actualización
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorMessage(json.body.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar. Inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Error inesperado");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar. Inténtalo de nuevo más tarde.",
      });
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <DefaultLayout>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <UserDataForm
          errorMessage={errorMessage}
          onSubmit={handleSubmit}
          initialData={{ username, name }}
          formTitle="Actualizar Perfil" // Proporcionar un título personalizado para la actualización
        />
      )}
    </DefaultLayout>
  );
};

export default UpdateProfile;