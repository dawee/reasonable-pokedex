const { Model, STRING } = require("sequelize");
const { SeenPokemon } = require("./seen-pokemon");

class User extends Model {
  static name = "users";

  static schema = {
    token: {
      type: STRING,
      allowNull: false
    }
  };

  static associate() {
    User.hasMany(SeenPokemon);
  }
}

module.exports = { User };
