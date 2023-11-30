const User = require("../model/user");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const Rol = require("../model/rol");

module.exports = {
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

  async register(req, res, next) {
    try {
      const user = req.body;
      const data = await User.create(user);

      await Rol.create(data.id, 1); // Rol por defecto

      return res.status(201).json({
        success: true,
        message: "Usuario registrado con éxito",
        data: data.id,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error al registrar el usuario",
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
            expiresIn: 60 * 60 * 24,
          }
        );
        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          image: myUser.image,
          session_token: `JWT ${token}`,
          roles: myUser.roles,
        };

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
};
