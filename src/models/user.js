const { Model, STRING } = require("sequelize");
const { SeenPokemon } = require("./seen-pokemon");

class User extends Model {
  static get name() {
    return "users";
  }

  static get schema() {
    return {
      token: {
        type: STRING,
        allowNull: false
      }
    };
  }

  static associate() {
    User.hasMany(SeenPokemon);
  }
}

module.exports = { User };
