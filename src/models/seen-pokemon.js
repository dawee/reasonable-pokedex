const { Model, STRING } = require("sequelize");

class SeenPokemon extends Model {
  static name = "seen_pokemons";

  static schema = {
    pokemonName: {
      type: STRING,
      allowNull: false
    }
  };
}

module.exports = { SeenPokemon };
