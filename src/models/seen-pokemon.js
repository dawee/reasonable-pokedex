const { Model, STRING } = require("sequelize");

class SeenPokemon extends Model {
  static get name() {
    return "seen_pokemons";
  }

  static get schema() {
    return {
      pokemonName: {
        type: STRING,
        allowNull: false
      }
    };
  }
}

module.exports = { SeenPokemon };
