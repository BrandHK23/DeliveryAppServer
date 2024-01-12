const Business = require("../model/business");
const storage = require("../utils/cloud_storage");

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await Business.getAll();
      console.log("Negocios: ", data);
      return res.status(201).json(data);
    } catch (error) {
      console.log("Error: ", error);
      return res.status(501).json({
        success: false,
        message: "Error al obtener los negocios",
      });
    }
  },

  async create(req, res, next) {
    try {
      const business = req.body;
      const data = await Business.create(business);

      return res.status(201).json({
        success: true,
        message: "Negocio creado con exito",
        data: data.id,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(501).json({
        success: false,
        message: "Error al crear el negocio",
        error: error,
      });
    }
  },

  async registerWithImage(req, res, next) {
    try {
      const business = JSON.parse(req.body.business);
      console.log("Datos del negocio: ", business);

      const files = req.files;
      if (files.length > 0) {
        const pathImage = `image_${Date.now()}`;
        const url = await storage(files[0], pathImage);
        if (url) {
          business.image = url;
        }
      }

      const businessId = await Business.create(business);
      return res.status(201).json({
        success: true,
        message: "Negocio creado con éxito",
        data: { id: businessId.id_business },
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al crear el negocio",
        error: error.message,
      });
    }
  },

  async getBusinessByUserId(req, res, next) {
    try {
      const userId = req.params.userId;
      const data = await Business.getBusinessByUserId(userId);

      console.log(
        `Datos del negocio para el usuario ${userId}: ${JSON.stringify(data)}`
      );

      if (data) {
        return res.status(200).json({
          success: true,
          message: "Negocio encontrado",
          data: data,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Negocio no encontrado para el usuario dado",
        });
      }
    } catch (error) {
      console.log(
        `Error al obtener el negocio para el usuario ${userId}: ${error}`
      );
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: error,
      });
    }
  },
};
