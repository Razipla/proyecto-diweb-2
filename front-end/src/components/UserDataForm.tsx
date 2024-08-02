import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../App.css";

interface UserDataFormProps {
  errorMessage: string;
  onSubmit: (username: string, password: string, name: string) => void;
  initialData?: {
    username: string;
    name: string;
  };
  formTitle: string; // Nueva prop para el título del formulario
}

const UserDataForm: React.FC<UserDataFormProps> = ({ errorMessage, onSubmit, initialData, formTitle }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUsername(initialData.username);
    }
  }, [initialData]);

  async function validationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios y no pueden contener solo espacios en blanco",
      });
      return;
    }
    setIsLoading(true);
    await onSubmit(username, password, name);
    setIsLoading(false);
  }

  return (
    <form className="form" onSubmit={validationSubmit}>
      <h1>{formTitle}</h1> {/* Usar la prop formTitle para el título */}
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}

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
        {isLoading ? "Procesando..." : "Actualizar usuario"}
      </button>
    </form>
  );
};

export default UserDataForm;