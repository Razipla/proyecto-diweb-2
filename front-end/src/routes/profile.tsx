import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import { API_URL } from "../auth/constants"
import PortalLayout from "../layout/portalLayout";
import "../App.css"
//ruta protegida solo visible cuando el usuario haga log-in correctamente
interface Todo {
    _id: string;
    title: string;
    completed: boolean;
    idUser: string,
}
export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const auth = useAuth();
    const user = auth.getUser();
    console.log(user);
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
                    Authorization: `Bearer ${auth.getAccessToken()}`
                },
                body: JSON.stringify({
                    user: { id: user?.id },
                    title,
                }),
            });
            if (response.ok) {
                const json = await response.json();
                setTodos([json, ...todos]);
            } else {
                //mostrar error
            }
            const data = await response.json();
            setTodos(data);

        } catch (error) {

        }

    }


    async function loadTodos() {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.getAccessToken()}`
                },
            });
            if (response.ok) {
                const json = await response.json();
                setTodos(json);
            } else {
                //mostrar error
            }
            const data = await response.json();
            setTodos(data);

        } catch (error) {

        }

    }
    return (
        <PortalLayout>
            <h1>Profile de {user?.name}</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input type="text" placeholder="nuevo todo..." onChange={(e) => setTitle(e.target.value)} value={title} />
            </form>
            {todos.map((todo) => (<div key={todo._id}>{todo.title}</div>))}
        </PortalLayout>);
}