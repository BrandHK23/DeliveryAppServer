const Category = require("../model/category");

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await Category.getAll();
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
      console.log(`Category: ${category}`);

      const data = await Category.create(category);

      return res.status(201).json({
        message: "Categoría creada",
        success: true,
        data: data.id,
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
