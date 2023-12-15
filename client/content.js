import { getAllData, getFilteredData, getRecipe } from "/data.js";
import RecipeView from "./recipeView.js";
import getImageURL from "./image.js";

class Content {
  constructor(element) {
    this.element = element;
    this.data = JSON.parse(window.localStorage.getItem("data")) || [];
  }
  async init_data() {
    this.data = await getAllData();
    window.localStorage.setItem("data", JSON.stringify(this.data));
  }
  async filter_data(filter) {
    this.data = await getFilteredData(filter);
    window.localStorage.setItem("data", JSON.stringify(this.data));
  }
  async render() {
    this.element.innerHTML = "";
    this.data.forEach(async (recipe) => {
      const recipeCard = document.createElement("img");
      recipeCard.classList.add("recipe-img");
      recipeCard.setAttribute(
        "src",
        await getImageURL(recipe.name, recipe.imageUrl)
      );
      recipeCard.setAttribute("alt", recipe.name);
      this.element.appendChild(recipeCard);
      window.localStorage.setItem(`img:${recipe.name}`, recipeCard.src);
      const createRecipeView = new RecipeView(recipeCard, recipe);
    });
  }
  deleteRecipe(recipeName) {
    this.data = this.data.filter((recipe) => recipe.name !== recipeName);
    window.localStorage.setItem("data", JSON.stringify(this.data));
  }
}

const content = document.getElementById("content");
const ContentComponent = new Content(content);
if (window.localStorage.getItem("data") === null) {
  await ContentComponent.init_data();
}
await ContentComponent.render();

export default ContentComponent;
