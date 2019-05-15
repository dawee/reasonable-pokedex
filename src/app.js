const cors = require("cors");
const express = require("express");
const pg = require("pg");
const Sequelize = require("sequelize");
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

  async getById(id) {
    return this.get(`/pokemon/${id}`);
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

  enum PokemonState {
    unseen
    seen
    caught
  }

  type Pokemon {
    id: Int!
    name: String!
    sprites: PokemonSpriteSheetCollection!
    state: PokemonState!
  }

  type Mutation {
    explore: Pokemon
  }

  type Query {
    pokemons(offset: Int!): [Pokemon!]!
    foo: String
  }
`;

var ownPokemons = [];

const dataSources = () => {
  return {
    pokeAPI: new PokeAPI()
  };
};

const resolvers = {
  Query: {
    foo: () => {
      const sequelize = new Sequelize(
        `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
          process.env.DB_HOST
        }:${process.env.DB_PORT}/${process.env.DB_NAME}`
      );

      class User extends Sequelize.Model {}
      User.init(
        {
          username: Sequelize.STRING,
          birthday: Sequelize.DATE
        },
        { sequelize, modelName: "user" }
      );

      return sequelize
        .sync()
        .then(() =>
          User.create({
            username: "janedoe",
            birthday: new Date(1980, 6, 20)
          })
        )
        .then(jane => JSON.stringify(jane.toJSON(), null, 2));
    },
    pokemons: (_source, { offset }, { dataSources }) =>
      dataSources.pokeAPI.getList(offset)
  },
  Mutation: {
    explore: async (_source, _args, { dataSources }) => {
      let randomPokemonId = Math.floor(Math.random() * Math.floor(150));
      let randomPokemon = await dataSources.pokeAPI.getById(randomPokemonId);
      ownPokemons.push(randomPokemon.id);
      return randomPokemon;
    }
  },
  Pokemon: {
    name: pokemon => capitalize(pokemon.name),
    state: pokemon => (ownPokemons.includes(pokemon.id) ? "seen" : "unseen")
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

app.use(cors());

server.applyMiddleware({ app });

module.exports = app;
