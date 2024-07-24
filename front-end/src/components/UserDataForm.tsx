import { useState } from "react";
import Swal from "sweetalert2";
import "../App.css";

interface UserDataFormProps {
  onSubmit: (username: string, password: string, name: string) => void;
  errorMessage: string;
}

const UserDataForm = ({ onSubmit, errorMessage }: UserDataFormProps) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function validationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !name.trim()) {
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
      <h1>Registro</h1>
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
        {isLoading ? "Creando usuario..." : "Crear usuario"}
      </button>
    </form>
  );
};

export default UserDataForm;
