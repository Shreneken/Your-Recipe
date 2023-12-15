export class RecipeBuilder {
  constructor() {
    this.name;
    this.ingredients;
    this.instructions;
  }
  setName(name) {
    this.name = name;
    return this;
  }
  setIngredients(ingredients) {
    this.ingredients = ingredients;
    return this;
  }
  setInstructions(instructions) {
    this.instructions = instructions;
    return this;
  }
  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
    return this;
  }
  build() {
    return new Recipe(this.name, this.ingredients, this.instructions, this.imageUrl);
  }
}

class Recipe {
  constructor(name, ingredients, instructions, imageUrl) {
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.imageUrl = imageUrl;
  }

  getName() {
    return this.name;
  }

  getIngredients() {
    return this.ingredients;
  }

  getInstructions() {
    return this.instructions;
  }

  getImageUrl() {
    return this.imageUrl;
  }
}
