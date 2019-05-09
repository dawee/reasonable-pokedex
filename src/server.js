const { RESTDataSource } = require("apollo-datasource-rest");

class PokeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pokeapi.co/api/v2";
  }

  async getByName(name) {
    return this.get(`/pokemon/${name}`);
  }

  async getList() {
    const data = await this.get("/pokemon?offset=130");
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

  return valid
    ? { back: sprites[backName], front: sprites[frontName] }
    : null;
}

function createServer({ ApolloServer, gql }) {
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
      pokemons: [Pokemon!]!
    }
  `;

  const dataSources = () => {
    return {
      pokeAPI: new PokeAPI()
    };
  };

  const resolvers = {
    Query: {
      pokemons: (_source, _args, { dataSources }) => dataSources.pokeAPI.getList()
    },
    Pokemon: {
      name: pokemon => capitalize(pokemon.name)
    },
    PokemonSpriteSheetCollection: {
      default: sprites => ({
        back: sprites["back_default"],
        front: sprites["front_default"]
      }),
      female: sprites => extractOptionalSprites(sprites, "back_female", "front_female"),
      shiny: sprites => extractOptionalSprites(sprites, "back_shiny", "front_shiny"),
      shinyFemale: sprites => extractOptionalSprites(sprites, "back_shinyFemale", "front_shinyFemale"),
    }
  };

  return new ApolloServer({
    dataSources,
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
}

module.exports = { createServer };