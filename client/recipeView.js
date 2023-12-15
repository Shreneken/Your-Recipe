import ModalView from "./ModalView.js";
import ContentComponent from "./content.js";
import imageDB from "./imagedb.js";
import UpdateRecipeView from "./updateRecipe.js";
import getImageURL from "./image.js";

class RecipeView extends ModalView {
  constructor(recipeCard, recipe) {
    super(
      recipeCard,
      "modal-2",
      async () => await this.addRecipeContent(recipe)
    );
  }
  async addRecipeContent(recipe) {
    const recipeContent = document.getElementById("recipe-content");
    recipeContent.innerHTML = `
    <div class="background-image" style="background-image: url(${await getImageURL(
      recipe.name,
      recipe.imageUrl
    )}"></div>
    <h1><span>${recipe.name}</span></h1>
    <br /><br />
    <p><span>Ingredients: ${recipe.ingredients}</span></p><br />
    <br /><br />
    <p><span>Instructions: ${recipe.instructions}</span></p><br />
    <br /><br />
      <button id="update-recipe">Update Recipe</button>
    <br /><br />
    <button id="delete-recipe">Delete Recipe</button>
    <br /><br />`;
    document
      .getElementById("delete-recipe")
      .addEventListener("click", async () => {
        const response = await fetch(`/delete?name=${recipe.name}`, {
          method: "DELETE",
        });
        if (response.ok) {
          ContentComponent.deleteRecipe(recipe.name);
          await ContentComponent.render();
          await imageDB.deleteBlob(recipe.name);
          alert("Recipe deleted successfully.");
        } else {
          alert("Failed to delete recipe.");
        }
      });
    const updateRecipeComponent = new UpdateRecipeView(
      document.getElementById("update-recipe"),
      recipe
    );
  }
}
export default RecipeView;
