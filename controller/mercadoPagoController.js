const mercadopago = require("mercadopago");
const Order = require("../model/order");
const OrderHasProduct = require("../model/order_has_products");
const User = require("../model/user");

mercadopago.configure({
  sandbox: true,
  access_token:
    "TEST-8913120874816489-122022-85a7f701d3a7eb5d8482b064952a053d-517315294",
});

module.exports = {
  async createPaymentCreditCard(req, res, next) {
    let payment = req.body;
    console.log(`Payment >>> ${JSON.stringify(payment)}`);

    const payment_data = {
      description: payment.description,
      transaction_amount: payment.transaction_amount,
      installments: payment.installments,
      payment_method_id: payment.payment_method_id,
      token: payment.token,
      issuer_id: payment.issuer_id,
      payer: {
        email: payment.payer.email,
      },
    };
    const data = await mercadopago.payment.create(payment_data).catch((err) => {
      console.log(err);
      return res.status(501).json({
        message: "Error al crear el pago",
        success: false,
        error: err,
      });
    });
    if (data) {
      console.log("Si hay datos correctos:", data.response);
      if (data !== undefined) {
        const payment_type_id = module.exports.validatePaymentMethod(
          payment.payment_type_id
        );
        payment.id_payment_method = payment_type_id;

        let order = payment.order;
        order.status = "CREATED";
        const dataPayment = await Order.create(order);

        // Recorrer los productos de la orden
        for (const product of order.products) {
          await OrderHasProduct.create(
            dataPayment.id,
            product.id,
            product.quantity
          );
        }

        return res.status(201).json(data.response);
      }
    } else {
      return res.status(501).json({
        message: "Error dato incorrecto en la petición",
        success: false,
      });
    }
  },

  validatePaymentMethod(status) {
    if (status === "credit_card") {
      status = 1;
    }
    if (status === "bank_transfer") {
      status = 2;
    }
    if (status === "ticket") {
      status = 3;
    }
    if (status === "upon_delivery") {
      status = 4;
    }

    return status;
  },
};
