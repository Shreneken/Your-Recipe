import ModalView from "./ModalView.js";
import ContentComponent from "./content.js";
import imageDB from "./imagedb.js";

class CreateRecipeView extends ModalView {
  constructor(element) {
    super(element, "modal-1");
    this.addCreateRecipeContent();
    document
      .querySelector("#create-submit")
      .addEventListener("click", this.create);
  }

  async create() {
    // get dom elements if they are not already taken
    this.rName = document.querySelector("#create-name").value;
    this.ingredients = document.querySelector("#create-ingredients").value;
    this.instructions = document.querySelector("#create-instructions").value;
    this.image = document.querySelector("#create-img").files[0];
    const notValid = [this.rName, this.ingredients, this.instructions, this.image].some(e => e === undefined);
    if (notValid) {
      alert("Please fill out all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("name", this.rName);
    formData.append("ingredients", this.ingredients);
    formData.append("instructions", this.instructions);
    formData.append("file", this.image);

    // send request to server
    const response = await fetch(`/create`, {
      method: "POST",
      body: formData,
    });
    // check if request was successful
    if (response.ok) {
      alert("Recipe created successfully!");
      await ContentComponent.init_data();
      await ContentComponent.render();
    } else {
      console.log(response.text());
      alert("Failed to create recipe, try again!");
    }
  }

  addCreateRecipeContent() {
    document.getElementById("create-form").innerHTML = `
    <div class="background-image" style="background-image: url(./images/cool-background.png)"></div>
    <h1>Create a new recipe!</h1>
    <label for="name">Recipe Name:</label><br />
    <input
      title="name"
      type="text"
      id="create-name"
      class="create-input"
      default=""
    required/>
    <br /><br />
    <label for="ingredients">Ingredients:</label><br />
    <textarea
      title="ingredients"
      type="text"
      id="create-ingredients"
      class="create-input"
    required></textarea
    ><br /><br />
    <label for="instructions">Instructions:</label><br />
    <textarea
      title="instructions"
      type="text"
      id="create-instructions"
      class="create-input"
    required></textarea>
    <br /><br />
    <input type="file" accept=".png,.jpg,.jpeg,.webp" id="create-img" required/>
    <br /><br />
    <input type="submit" value="Submit" id="create-submit" />`;
  }
}

const createRecipeElem = document.getElementById("create-recipes");
const createRecipeComponent = new CreateRecipeView(createRecipeElem);
export default createRecipeComponent;
