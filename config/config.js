const promise = require("bluebird");
const e = require("express");
const options = {
  promiseLib: promise,
  query: (e) => {},
};

const pgp = require("pg-promise")(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function (stringValue) {
  return stringValue;
});

const databaseConfig = {
  host: "127.0.0.1",
  port: 5432,
  database: "Delivery_db_2",
  user: "postgres",
  password: "brandAdmin",
};

const db = pgp(databaseConfig);

module.exports = db;
