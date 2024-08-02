const express = require('express');
const router = express.Router();
const Todo = require('../schema/todo');
const protect = require('../Auth/authenticate');

// Ruta para obtener todas las tareas
router.get("/", protect, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        res.status(500).json({ error: "Error al obtener las tareas" });
    }
});

// Ruta para crear una nueva tarea
router.post("/", protect, async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        if (!title || !userId || !username) {
            return res.status(400).json({ error: "Título, ID de usuario y nombre de usuario son requeridos" });
        }

        const newTodo = new Todo({ title, idUser: userId, username });
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error al crear la tarea:", error);
        res.status(500).json({ error: "Error al crear la tarea" });
    }
});

// Ruta para eliminar una tarea
router.delete("/:id", protect, async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user.id;

        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }

        // Verificar si el usuario es el propietario de la publicación
        if (todo.idUser.toString() !== userId) {
            return res.status(403).json({ error: "No autorizado para eliminar esta publicación" });
        }

        await todo.deleteOne();
        res.status(200).json({ message: "Publicación eliminada" });
    } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        res.status(500).json({ error: "Error al eliminar la publicación" });
    }
});

// Ruta para dar like a una tarea
router.post("/:todoId/like", protect, async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const userId = req.user.id;
        const username = req.user.username;

        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        if (!todo.likes.includes(userId)) {
            todo.likes.push(userId);
            todo.likedBy.push({ username, userId });
            await todo.save();
        }

        res.status(200).json(todo);
    } catch (error) {
        console.error("Error al dar like a la tarea:", error);
        res.status(500).json({ error: "Error al dar like a la tarea" });
    }
});

// Ruta para quitar like de una tarea
router.post("/:todoId/unlike", protect, async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const userId = req.user.id;

        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        todo.likes = todo.likes.filter(like => like.toString() !== userId);
        todo.likedBy = todo.likedBy.filter(like => like.userId.toString() !== userId);
        await todo.save();

        res.status(200).json(todo);
    } catch (error) {
        console.error("Error al quitar like de la tarea:", error);
        res.status(500).json({ error: "Error al quitar like de la tarea" });
    }
});

module.exports = router;