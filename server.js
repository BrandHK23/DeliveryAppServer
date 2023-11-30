// Objetivo: Archivo principal del servidor
// Fecha creación: 2023-10-11
// Autor: Brandon Hinojosa

//Importaciones
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const loggrt = require("morgan");
const cors = require("cors");

/*
  Rutas
*/
const users = require("./routes/usersRoutes");

const port = process.env.PORT || 3000;

//Middlewares
app.use(loggrt("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.disable("x-powered-by");

app.set("port", port);

users(app);
// 192.168.0.18 Zitacuaro
// 192.168.1.165 Morelia
server.listen(3000, "192.168.0.13" || "localhost", () => {
  console.log(`Server running on port ${port} ` + process.pid);
});

//Rutas

app.get("/", (req, res) => {
  res.send("Ruta principal del servidor");
});

app.get("/api", (req, res) => {
  res.send("Ruta API");
});

//Error handler
app.use((req, res, next) => {
  console.log("Error 404, ruta no encontrada");
  res.status(404).send(err.stack);
});

module.exports = {
  app: app,
  server: server,
};
