import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

class RecipeDb {
  constructor(dburl) {
    this.dburl = dburl;
  }
  async connect() {
    this.client = await new MongoClient(this.dburl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    }).connect();
    this.db = this.client.db("recipes");
    this.collection = this.db.collection("recipes");
  }

  async close() {
    this.client.close();
  }

  async getAllRecipes() {
    try {
      const response = await this.collection.find({}).toArray();
      return response;
    } catch {
      return -1;
    }
  }

  async getFilterRecipes(filter) {
    try {
      const response = await this.collection.find({name: {$regex: `^${filter}`}}).toArray();
      return response === null ? -1 : response;
    } catch {
      return -1;
    }
  }

  async addRecipe(recipe) {
    try {
      await this.collection.insertOne({
        _id: recipe.getName(),
        name: recipe.getName(),
        ingredients: recipe.getIngredients(),
        instructions: recipe.getInstructions(),
        imageUrl: recipe.getImageUrl(),
      });
      return 1;
    } catch {
      return -1;
    }
  }

  async updateRecipe(recipe) {
    try {
      await this.collection.updateOne(
        { _id: recipe.getName() },
        {
          $set: {
            name: recipe.getName(),
            ingredients: recipe.getIngredients(),
            instructions: recipe.getInstructions(),
            imageUrl: recipe.getImageUrl(),
          },
        }
      );
      return 1;
    } catch {
      return -1;
    }
  }

  async getRecipe(name) {
    try {
      const response = await this.collection.findOne({ _id: name });
      return response === null ? -1 : response;
    } catch {
      return -1;
    }
  }
  async deleteRecipe(name) {
    try {
      await this.collection.deleteOne({ _id: name });
    } catch {
      return -1;
    }
  }
}
export default RecipeDb;
