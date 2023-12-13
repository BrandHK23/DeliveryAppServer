const Order = require("../model/order");
const OrderHasProducts = require("../model/order_has_products");

module.exports = {
  async findByStatus(req, res, next) {
    try {
      const status = req.params.status;
      const data = await Order.findByStatus(status);
      console.log(`Status: ${JSON.stringify(data)}`);
      return res.status(201).json({
        message: "Ordenes obtenidas",
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        message: "Error al obtener las ordenes",
        success: false,
        error: error,
      });
    }
  },

  async create(req, res, next) {
    try {
      let order = req.body;
      order.status = "CREATED";
      const data = await Order.create(order);

      // Recorrer los productos de la orden
      for (const product of order.products) {
        await OrderHasProducts.create(data.id, product.id, product.quantity);
      }

      return res.status(200).json({
        success: true,
        message: "La orden se creó correctamente",
        data: data.id,
      });
    } catch (error) {
      console.log("error ${error}");
      return res.status(501).json({
        success: false,
        message: "Hubo un error al crear la orden",
        errors: error,
      });
    }
  },
};
