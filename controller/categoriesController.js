const Category = require("../model/category");

module.exports = {
  async getAll(req, res, next) {
    try {
      // Suponiendo que obtienes el ID del usuario de alguna manera (e.g., desde el token de sesión)
      const userId = req.user.id; // Asegúrate de cambiar esto según cómo manejes la autenticación

      const data = await Category.getByUserId(userId); // Cambiado a getByUserId
      console.log(`Categories: ${JSON.stringify(data)}`);
      return res.status(201).json({
        message: "Categorías obtenidas",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        message: "Error al obtener las categorías",
        success: false,
        error: error,
      });
    }
  },

  async create(req, res, next) {
    try {
      const category = req.body;
      const userId = req.user.id; // Asume que el ID del usuario se obtiene de la sesión o el token

      console.log(`Category: ${JSON.stringify(category)}`);

      const data = await Category.create(category, userId); // Ahora pasa también el userId

      return res.status(201).json({
        message: "Categoría creada",
        success: true,
        data: data.id, // Asegúrate de que data.id exista y sea correcto
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        message: "Error al crear la categoría",
        success: false,
        error: error,
      });
    }
  },
};
