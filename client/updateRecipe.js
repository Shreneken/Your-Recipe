import ModalView from "./ModalView.js";
import ContentComponent from "./content.js";
import imageDB from "./imagedb.js";

class UpdateRecipeView extends ModalView {
  constructor(element, oldRecipe) {
    super(element, "modal-3", ModalView.closeModal);
    this.name = oldRecipe.name;
    this.oldInstructions = oldRecipe.instructions;
    this.oldIngredients = oldRecipe.ingredients;
    this.addUpdateRecipeContent();
    document
      .querySelector("#update-submit")
      .addEventListener("click", () => this.update(this.name));
  }

  async update(name) {
    // get dom elements if they are not already taken
    this.name = name;
    this.ingredients = document.querySelector("#update-ingredients").value;
    this.instructions = document.querySelector("#update-instructions").value;
    this.image = document.querySelector("#update-img").files[0];
    const notValid = [this.ingredients, this.instructions, this.image].some(
      (e) => e === undefined
    );
    if (notValid) {
      alert("Please fill out all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("ingredients", this.ingredients);
    formData.append("instructions", this.instructions);
    formData.append("file", this.image);

    // send request to server
    const response = await fetch(`/update`, {
      method: "PUT",
      body: formData,
    });
    // check if request was successful
    if (response.ok) {
      alert("Recipe updated successfully!");
      await imageDB.deleteBlob(this.name);
      await ContentComponent.init_data();
      await ContentComponent.render();
    } else {
      alert("Failed to update recipe, try again!");
    }
  }

  addUpdateRecipeContent() {
    document.getElementById("update-form").innerHTML = `
    <div class="background-image" style="background-image: url(./images/cool-background.png)"></div>
    <h1>Update recipe for: ${this.name}</h1>
    <br /><br />
    <label for="ingredients">Ingredients:</label><br />
    <textarea
      title="ingredients"
      type="text"
      id="update-ingredients"
      class="create-input"
    required>${this.oldIngredients}</textarea
    ><br /><br />
    <label for="instructions">Instructions:</label><br />
    <textarea
      title="instructions"
      type="text"
      id="update-instructions"
      class="create-input"
    required>${this.oldInstructions}</textarea>
    <br /><br />
    <input type="file" accept=".png,.jpg,.jpeg,.webp" id="update-img" required/>
    <br /><br />
    <input type="submit" value="Submit" id="update-submit" />`;
  }
}

export default UpdateRecipeView;
