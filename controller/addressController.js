const Address = require("../model/address");

module.exports = {
  async findByUser(req, res, next) {
    try {
      const id_user = req.params.id_user;
      const data = await Address.findByUser(id_user);
      console.log(`Address: ${JSON.stringify(data)}`);
      return res.status(201).json({
        message: "Categorías obtenidas",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        message: "Error al obtener las direcciones",
        success: false,
        error: error,
      });
    }
  },

  async create(req, res, next) {
    try {
      const address = req.body;
      const data = await Address.create(address);

      return res.status(200).json({
        success: true,
        message: "Dirección creada correctamente",
        data: data.id,
      });
    } catch (error) {
      console.log("error ${error}");
      return res.status(501).json({
        success: false,
        message: "Hubo un error al crear la dirección",
        errors: error,
      });
    }
  },
};
