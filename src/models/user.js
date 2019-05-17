const { Model, STRING } = require("sequelize");
const { model: SeenPokemon } = require("./seen-pokemon");

const name = "user";

const schema = {
  token: {
    type: STRING,
    allowNull: false
  }
};

class User extends Model {}

const associate = () => User.hasMany(SeenPokemon);

module.exports = { associate, model: User, name, schema };
