const UsersControllers = require("../controller/usersController");
const passport = require("passport");

module.exports = (app, upload) => {
  app.get(
    "/api/users/userHasBusiness/:id",
    passport.authenticate("jwt", { session: false }),
    UsersControllers.userHasBusiness
  );
  app.get("/api/users/getAll", UsersControllers.getAll);
  app.get("/api/users/findDeliveryMen", UsersControllers.findDeliveryMen);

  app.get(
    "/api/users/findById/:id",
    passport.authenticate("jwt", { session: false }),
    UsersControllers.findById
  );

  app.post(
    "/api/users/create",
    upload.array("image", 1),
    UsersControllers.registerWithImage
  );

  app.post("/api/users/login", UsersControllers.login);

  // Actualizar datos de usuario
  app.put(
    "/api/users/update",
    passport.authenticate("jwt", { session: false }),
    upload.array("image", 1),
    UsersControllers.update
  );

  app.post("/api/users/logout", UsersControllers.logout);
};
