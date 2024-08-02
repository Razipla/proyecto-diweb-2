import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import { API_URL } from "../auth/constants";
import PortalLayout from "../layout/portalLayout";
import "../App.css";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  idUser: string;
  username: string;
  likes: string[];
  likedBy: { username: string, userId: string }[];
}

export default function Profile() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const auth = useAuth();
  const user = auth.getUser();

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createTodo();
  }

  async function createTodo() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({ title, idUser: user?.id }),
      });
      if (response.ok) {
        const json = await response.json();
        setTodos([json, ...todos]);
      } else {
        console.error("Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error al crear la tarea", error);
    }
  }

  async function loadTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        setTodos(json);
      } else {
        console.error("Error al cargar las tareas");
      }
    } catch (error) {
      console.error("Error al cargar las tareas", error);
    }
  }

  async function handleLike(todoId: string) {
    try {
      const response = await fetch(`${API_URL}/todos/${todoId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        setTodos(todos.map(todo => todo._id === todoId ? json : todo));
      } else {
        console.error("Error al dar like");
      }
    } catch (error) {
      console.error("Error al dar like", error);
    }
  }

  async function handleUnlike(todoId: string) {
    try {
      const response = await fetch(`${API_URL}/todos/${todoId}/unlike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        setTodos(todos.map(todo => todo._id === todoId ? json : todo));
      } else {
        console.error("Error al quitar like");
      }
    } catch (error) {
      console.error("Error al quitar like", error);
    }
  }

  async function handleDelete(todoId: string) {
    try {
      const response = await fetch(`${API_URL}/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });
      if (response.ok) {
        setTodos(todos.filter(todo => todo._id !== todoId));
      } else {
        console.error("Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("Error al eliminar la tarea", error);
    }
  }

  return (
    <PortalLayout>
      <h2>Sala <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>{user?.username} en línea <span style={{ color: 'green' }}>●</span></span></h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Haz publicación..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <button type="submit">Publicar</button>
      </form>
      {todos.slice().reverse().map(todo => (
        <div 
          key={todo._id} 
          style={{
            backgroundColor: todo.idUser === user?.id ? "#fbc531" : "#273c75", 
            color: todo.idUser === user?.id ? "#273c75" : "#fbc531",
            padding: "10px", 
            borderRadius: "5px", 
            marginBottom: "10px"
          }}
        >
          <h3>{todo.title}</h3>
          <p>Created by: {todo.username}</p>
          <p>Likes: {todo.likes.length}</p>
          <button onClick={() => handleLike(todo._id)}>Like</button>
          <button onClick={() => handleUnlike(todo._id)}>Unlike</button>
          {/* Mostrar botón de eliminar solo si el usuario actual es el creador */}
          {todo.idUser === user?.id && (
            <button onClick={() => handleDelete(todo._id)}>Eliminar</button>
          )}
          <p>Liked by: {todo.likedBy.map(user => user.username).join(", ")}</p>
        </div>
      ))}
    </PortalLayout>
  );
} 