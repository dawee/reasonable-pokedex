const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type PokemonSprite {
    front: String!
    back: String!
  }

  type PokemonSpecies {
    id: String!
    name: String!
    seen: Boolean!
    sprite: PokemonSprite!
  }

  type Query {
    pokemonSpecies(limit: Int, offset: Int): [PokemonSpecies!]!
  }
`;

const resolvers = {
  Query: {
    pokemonSpecies: (_data, args = {}, context) => {
      const { limit = 151, offset = 0 } = args;
      const {
        dataSources: { pokeAPI }
      } = context;

      // const { sequelize, User } = context;

      // await User.create({ token: "foo" });

      return pokeAPI.getList(limit, offset);
    }
  },
  PokemonSpecies: {
    id: data => data.name,
    seen: async (_data, _args, context) => {
      return false;
    },
    sprite: async (data, _args, context) => {
      const {
        dataSources: { pokeAPI }
      } = context;
      const { sprites } = await pokeAPI.getByName(data.name);

      return sprites;
    }
  },
  PokemonSprite: {
    front: data => data.front_default,
    back: data => data.back_default
  }
};

module.exports = { typeDefs, resolvers };
