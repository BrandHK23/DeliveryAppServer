const addressController = require("../controller/addressController");
const passport = require("passport");

module.exports = (app) => {
  // Get all address

  app.get(
    "/api/address/findByUser/:id_user",
    passport.authenticate("jwt", { session: false }),
    addressController.findByUser
  );

  app.post(
    "/api/address/create",
    passport.authenticate("jwt", { session: false }),
    addressController.create
  );
};
