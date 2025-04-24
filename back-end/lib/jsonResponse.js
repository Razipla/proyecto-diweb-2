//unifica lo que se manda de respuesta desde el servidor al frontend

const jsonResponse = (res, status, message) => {
    res.status(status).json({ message });
  };

module.exports = { jsonResponse };