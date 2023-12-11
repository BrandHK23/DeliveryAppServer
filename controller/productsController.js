const Product = require("../model/product");
const storage = require("../utils/cloud_storage");
const asyncForEach = require("../utils/async_foreach");

module.exports = {
  async findByCategory(req, res, next) {
    try {
      const id_category = req.params.id_category;
      const data = await Product.findByCategory(id_category);

      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        message: "Error al obtener los productos por categoría",
        success: false,
        error: error,
      });
    }
  },

  async create(req, res, next) {
    let product = JSON.parse(req.body.product);
    console.log(`Product: ${JSON.stringify(product)}`);

    const files = req.files;

    let inserts = 0;

    if (files.length === 0) {
      return res.status(501).json({
        message: "Error al crear el producto, no tiene imagen",
        success: false,
      });
    } else {
      try {
        const data = await Product.create(product); //Almacena la información
        product.id = data.id;

        const start = async () => {
          await asyncForEach(files, async (file) => {
            const pathImge = `image_${Date.now()}`;
            const url = await storage(file, pathImge);

            if (url !== undefined && url !== null) {
              if (inserts == 0) {
                product.image1 = url;
              } else if (inserts == 1) {
                product.image2 = url;
              } else if (inserts == 2) {
                product.image3 = url;
              }
            }
            await Product.update(product);
            inserts++;

            if (inserts == files.length) {
              return res.status(201).json({
                message: "Producto creado correctamente",
                success: true,
                data: data.id,
              });
            }
          });
        };
        start();
      } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(501).json({
          message: "Error al crear el producto" + error,
          success: false,
          error: error,
        });
      }
    }
  },
};
