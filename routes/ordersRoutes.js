const ordersController = require("../controller/ordersController");
const passport = require("passport");

module.exports = (app) => {
  // Get all address

  app.get(
    "/api/order/findByStatus/:status",
    passport.authenticate("jwt", { session: false }),
    ordersController.findByStatus
  );

  app.post(
    "/api/order/create",
    passport.authenticate("jwt", { session: false }),
    ordersController.create
  );
};
