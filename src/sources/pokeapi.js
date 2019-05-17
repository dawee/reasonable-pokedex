const { RESTDataSource } = require("apollo-datasource-rest");

class PokeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pokeapi.co/api/v2";
  }

  async getByName(name) {
    return this.get(`/pokemon/${name}`);
  }

  async getList(limit, offset) {
    const { results = [] } = await this.get(
      `/pokemon?limit=${limit}&offset=${offset}`
    );

    return results;
  }
}

module.exports = { PokeAPI };
