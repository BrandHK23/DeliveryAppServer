// Objetivo: Archivo principal del servidor
// Fecha creación: 2023-10-11
// Autor: Brandon Hinojosa

// Importaciones
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan"); // Corregido de 'loggrt' a 'logger'
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const passport = require("passport");
const io = require("socket.io")(server);
const mercadopago = require("mercadopago");

// Configuración de Mercado Pago
mercadopago.configure({
  access_token:
    "TEST-8913120874816489-122022-85a7f701d3a7eb5d8482b064952a053d-517315294",
});

/* Socket.io */
const orderDeliverySocket = require("./sockets/orders_delivery_socket");

// Inicialización de Firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const upload = multer({
  storage: multer.memoryStorage(),
});

// Rutas
const users = require("./routes/usersRoutes");
const categories = require("./routes/categoriesRoutes");
const products = require("./routes/productsRoutes");
const address = require("./routes/addressRoutes");
const orders = require("./routes/ordersRoutes");
const mercadopagoRoutes = require("./routes/mercadoPagoRoutes");

// Puerto
const port = process.env.PORT || 3000;

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.disable("x-powered-by");

app.set("port", port);

// Socket.io
orderDeliverySocket(io);

// Configuración de rutas
users(app, upload);
categories(app);
products(app, upload);
orders(app);
address(app);
mercadopagoRoutes(app);

// Rutas principales
app.get("/", (req, res) => {
  res.send("Ruta principal del servidor");
});

app.get("/api", (req, res) => {
  res.send("Ruta API");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

// Inicio del servidor
server.listen(port, () => {
  console.log(`Server running on port ${port} - PID: ${process.pid}`);
});

module.exports = {
  app: app,
  server: server,
};
