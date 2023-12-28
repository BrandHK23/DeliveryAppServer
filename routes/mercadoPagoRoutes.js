const MercadoPagoController = require("../controller/mercadoPagoController");
const passport = require("passport");

module.exports = (app) => {
  app.post(
    "/api/payments/createPay",
    passport.authenticate("jwt", { session: false }),
    MercadoPagoController.createPaymentCreditCard
  );
};
