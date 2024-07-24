const router = require("express").Router();
const Todo = require("../schema/todo");
const authenticate = require("../Auth/authenticate");

router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "No autorizado: Usuario no encontrado" });
    }
    const todos = await Todo.find({ idUser: req.user.id });
    if (todos) {
      res.json(todos);
    } else {
      res.status(404).json({ error: "Todos no encontrados" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", authenticate, async (req, res) => {
  console.log(req.body);

  if (!req.body.title) {
    return res.status(400).json({ error: "Título requerido" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "No autorizado: Usuario no encontrado" });
  }

  try {
    const todo = new Todo({
      title: req.body.title,
      completed: false,
      idUser: req.user.id,
    });
    const newTodo = await todo.save();
    res.status(200).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;