const { Model, STRING } = require("sequelize");

const name = "seen_pokemon";

const schema = {
  pokemonName: {
    type: STRING,
    allowNull: false
  }
};

class SeenPokemon extends Model {}

module.exports = { model: SeenPokemon, name, schema };
