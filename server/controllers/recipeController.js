import { RecipeBuilder } from "../utils/recipe.js";
import fs from "fs";

class RecipeController {
  constructor(recipeDb) {
    this.recipeDb = recipeDb;
  }

  async saveRecipe(receivedRecipe) {
    const newRecipe = new RecipeBuilder()
      .setName(this._firstCharToUpper(receivedRecipe.name))
      .setIngredients(receivedRecipe.ingredients)
      .setInstructions(receivedRecipe.instructions)
      .setImageUrl(receivedRecipe.imageUrl)
      .build();
    const result = await this.recipeDb.addRecipe(newRecipe);
    if (result === -1) {
      console.log("Failed to save recipe");
      fs.unlink(`server/uploads/${receivedRecipe.imageUrl}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } else {
      console.log("Successfully saved recipe");
    }
    return result;
  }

  async getRecipe(name) {
    const recipe = await this.recipeDb.getRecipe(this._firstCharToUpper(name));
    if (recipe === -1) {
      console.log("Failed to get recipe");
      return -1;
    }
    console.log("Successfully got recipe");
    delete recipe["_id"];
    return recipe;
  }

  async getAllRecipes() {
    const recipes = await this.recipeDb.getAllRecipes();
    if (recipes === -1) {
      console.log("Failed to get all recipes");
      return -1;
    }
    console.log("Successfully got all recipes");
    recipes.forEach((e) => delete e["_id"]);
    return recipes;
  }

  async getFilterRecipes(filter) {
    const recipes = await this.recipeDb.getFilterRecipes(
      this._firstCharToUpper(filter)
    );
    if (recipes === -1) {
      console.log("Failed to get filtered recipes");
      return -1;
    }
    console.log("Successfully got filtered recipes");
    recipes.forEach((e) => delete e["_id"]);
    return recipes;
  }

  async modifyRecipe(receivedRecipe) {
    const oldRecipe = await this.recipeDb.getRecipe(
      this._firstCharToUpper(receivedRecipe.name)
    );
    const newRecipe = new RecipeBuilder()
      .setName(this._firstCharToUpper(receivedRecipe.name))
      .setIngredients(receivedRecipe.ingredients)
      .setInstructions(receivedRecipe.instructions)
      .setImageUrl(receivedRecipe.imageUrl)
      .build();
    const result = await this.recipeDb.updateRecipe(newRecipe);
    if (result !== -1) {
      console.log("Successfully modified recipe");
      fs.unlink(`server/uploads/${oldRecipe.imageUrl}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } else {
      console.log("Failed to modify recipe");
      fs.unlink(`server/uploads/${receivedRecipe.imageUrl}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    return result;
  }

  async deleteRecipe(name) {
    const recipe = await this.recipeDb.getRecipe(this._firstCharToUpper(name));
    if (recipe === -1) {
      console.log("Recipe to delete does not exist");
      return -1;
    }
    const result = await this.recipeDb.deleteRecipe(name);
    if (result !== -1) {
      console.log("Successfully deleted recipe");
      fs.unlink(`server/uploads/${recipe.imageUrl}`, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } else {
      console.log("Failed to delete recipe");
    }
  }

  _firstCharToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
export default RecipeController;
