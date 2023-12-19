const ordersController = require("../controller/ordersController");
const passport = require("passport");

module.exports = (app) => {
  // Get all address

  app.get(
    "/api/order/findByDeliveryAndStatus/:id_delivery/:status",
    passport.authenticate("jwt", { session: false }),
    ordersController.findByDeliveryAndStatus
  );

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

  app.put(
    "/api/order/updateToPrepared",
    passport.authenticate("jwt", { session: false }),
    ordersController.updateToPrepared
  );

  app.put(
    "/api/order/updateToOnTheWay",
    passport.authenticate("jwt", { session: false }),
    ordersController.updateToOnTheWay
  );

  app.put(
    "/api/order/updateToOnDelivered",
    passport.authenticate("jwt", { session: false }),
    ordersController.updateToOnDelivered
  );
};
