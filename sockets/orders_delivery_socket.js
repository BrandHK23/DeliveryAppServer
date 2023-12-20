module.exports = (io) => {
  const orderDeliveryNamespace = io.of("/orders/delivery");
  orderDeliveryNamespace.on("connection", function (socket) {
    console.log("A user connected to /orders/delivery namespace");
    socket.on("position", function (data) {
      console.log(`Position received from ${JSON.stringify(data)}`);
      orderDeliveryNamespace.emit(`position/${data.id_order}`, {
        lat: data.lat,
        lng: data.lng,
      });
    });
    socket.on("disconnect", function (data) {
      console.log("A user disconnected from /orders/delivery namespace");
    });
  });
};
