const Sequelize = require("sequelize");
const models = require("./models");

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const uri = `postgres://${user}:${password}@${host}:${port}/${dbName}`;
const sequelize = new Sequelize(uri);

Object.values(models).forEach(({ model, name, schema }) =>
  model.init(schema, { sequelize, modelName: name })
);

Object.values(models).forEach(({ associate }) => {
  if (associate) {
    associate();
  }
});

module.exports = { sequelize };
