async function getAllData() {
  return fetch("/dump").then((res) => res.json());
}

async function getFilteredData(filter) {
  return fetch(`/filter?name=${filter}`).then((res) => res.json());
}

async function getRecipe(name) {
  return fetch(`/recipe?name=${name}`).then((res) => res.json());
}


export { getAllData, getFilteredData, getRecipe };