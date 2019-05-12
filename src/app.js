const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { RESTDataSource } = require("apollo-datasource-rest");

class PokeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pokeapi.co/api/v2";
  }

  async getByName(name) {
    return this.get(`/pokemon/${name}`);
  }

  async getList(offset) {
    const data = await this.get(`/pokemon?offset=${offset}`);
    const promises = data.results.map(pokemon => this.getByName(pokemon.name));

    return Promise.all(promises);
  }
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function extractOptionalSprites(sprites, backName, frontName) {
  const valid =
    sprites.hasOwnProperty(backName) &&
    sprites.hasOwnProperty(frontName) &&
    typeof sprites[backName] === "string" &&
    typeof sprites[frontName] === "string" &&
    sprites[backName].length > 0 &&
    sprites[frontName].length > 0;

  return valid ? { back: sprites[backName], front: sprites[frontName] } : null;
}

const typeDefs = gql`
  type PokemonPostureSpriteSheet {
    back: String!
    front: String!
  }

  type PokemonSpriteSheetCollection {
    default: PokemonPostureSpriteSheet!
    female: PokemonPostureSpriteSheet
    shiny: PokemonPostureSpriteSheet
    shinyFemale: PokemonPostureSpriteSheet
  }

  type Pokemon {
    id: Int!
    name: String!
    sprites: PokemonSpriteSheetCollection!
  }

  type Query {
    pokemons(offset: Int!): [Pokemon!]!
  }
`;

const dataSources = () => {
  return {
    pokeAPI: new PokeAPI()
  };
};

const resolvers = {
  Query: {
    pokemons: (_source, { offset }, { dataSources }) =>
      dataSources.pokeAPI.getList(offset)
  },
  Pokemon: {
    name: pokemon => capitalize(pokemon.name)
  },
  PokemonSpriteSheetCollection: {
    default: sprites => ({
      back: sprites["back_default"],
      front: sprites["front_default"]
    }),
    female: sprites =>
      extractOptionalSprites(sprites, "back_female", "front_female"),
    shiny: sprites =>
      extractOptionalSprites(sprites, "back_shiny", "front_shiny"),
    shinyFemale: sprites =>
      extractOptionalSprites(sprites, "back_shinyFemale", "front_shinyFemale")
  }
};

const server = new ApolloServer({
  dataSources,
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

const app = express();

server.applyMiddleware({ app });

module.exports = app;
