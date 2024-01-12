const User = require("../model/user");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const Rol = require("../model/rol");
const storage = require("../utils/cloud_storage");

module.exports = {
  async userHasBusiness(req, res, next) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID de usuario no proporcionado",
        });
      }

      const data = await User.userHasBusiness(id);
      if (data) {
        console.log(`Usuario: ${JSON.stringify(data)}`);
        return res.status(200).json({
          success: true,
          userHasBusiness: data.user_has_business,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al obtener el estado del negocio del usuario",
      });
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await User.getAll();
      console.log(`Usuarios: ${data}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al obtener los usuarios",
      });
    }
  },

  async findDeliveryMen(req, res, next) {
    try {
      const data = await User.findDeliveryMen();
      console.log(`Repartidores: ${data}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al obtener los repartidores",
      });
    }
  },

  async findById(req, res, next) {
    try {
      const id = req.params.id;

      const data = await User.findUserId(id);
      console.log(`Usuario: ${data}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al obtener el usuario",
      });
    }
  },

  async register(req, res, next) {
    try {
      const user = req.body;
      const userId = await User.create(user); // Recibe el ID directamente

      await Rol.create(userId, 1); // Rol por defecto

      return res.status(201).json({
        success: true,
        message: "Usuario registrado con éxito",
        data: { id: userId }, // Envía el ID como parte del objeto de datos
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al registrar el usuario",
      });
    }
  },

  async registerWithImage(req, res, next) {
    try {
      const user = JSON.parse(req.body.user);
      console.log("Datos del usuario: ", user);

      const files = req.files;

      if (files.length > 0) {
        const pathImage = `image_${Date.now()}`; // Nombre del archivo en Firebase Storage
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          user.image = url;
        }
      }

      const userId = await User.create(user); // Recibe el ID directamente

      await Rol.create(userId, 1); // Rol por defecto

      return res.status(201).json({
        success: true,
        message: "Usuario registrado con éxito",
        data: { id: userId }, // Envía el ID como parte del objeto de datos
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al registrar el usuario",
      });
    }
  },

  async update(req, res, next) {
    try {
      const user = JSON.parse(req.body.user);
      console.log("Datos del usuario: ", req.body);

      const files = req.files;

      if (files.length > 0) {
        const pathImage = `image_${Date.now()}`; // Nombre del archivo en Firebase Storage
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          user.image = url;
        }
      }

      await User.update(user); // Recibe el ID directamente

      return res.status(201).json({
        success: true,
        message: "Datos actualizados con éxito",
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al actualizar los datos del usuario",
      });
    }
  },

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const myUser = await User.findByEmail(email);
      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      if (User.isPasswordMatched(password, myUser.password)) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email },
          keys.secretOrKey,
          {
            // expiresIn: 60 * 60 * 24,
          }
        );
        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          image: myUser.image,
          user_has_business: myUser.user_has_business,
          session_token: `JWT ${token}`,
          roles: myUser.roles,
        };

        await User.updateToken(myUser.id, `JWT ${token}`);

        console.log(`Usuario: ${data}`);
        return res.status(201).json({
          success: true,
          message: "Inicio de sesión exitoso",
          data: data,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Contraseña incorrecta",
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al iniciar sesión",
        error: error,
      });
    }
  },
  async logout(req, res, next) {
    try {
      const id = req.body.id;

      await User.updateToken(id, null);

      return res.status(201).json({
        success: true,
        message: "Sesión cerrada con éxito",
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al cerrar sesión",
        error: error,
      });
    }
  },
};
