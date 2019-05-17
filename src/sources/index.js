const { PokeAPI } = require("./pokeapi");

module.exports = {
  dataSources: () => ({
    pokeAPI: new PokeAPI()
  })
};
