import ModalView from "./ModalView.js";
import ContentComponent from "./content.js";
import createRecipeComponent from "./createRecipe.js";

window.addEventListener("load", function () {
  // close modals on background click
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("create-modal")) {
      ModalView.closeModal();
    }
  });
});

document
  .getElementsByClassName("scroll-btn")[0]
  .addEventListener("click", () => {
    const content = document.getElementById("content");
    let contentOffset = parseInt(content.getAttribute("data-offset"));
    if (contentOffset + 20 <= 0) {
      contentOffset += 20;
      content.setAttribute("data-offset", contentOffset);
    } else {
      contentOffset = 0;
      content.setAttribute("data-offset", contentOffset);
    }
    content.animate([{ transform: `translate(${contentOffset}%, -50%)` }], {
      duration: 600,
      fill: "forwards",
      iterations: 1,
    });
  });

document
  .getElementsByClassName("scroll-btn")[1]
  .addEventListener("click", () => {
    const content = document.getElementById("content");
    let contentOffset = parseInt(content.getAttribute("data-offset"));
    if (contentOffset - 20 >= -100) {
      contentOffset -= 20;
      content.setAttribute("data-offset", contentOffset);
    } else {
      contentOffset = -100;
      content.setAttribute("data-offset", contentOffset);
    }
    content.animate([{ transform: `translate(${contentOffset}%, -50%)` }], {
      duration: 1000,
      fill: "forwards",
    });
  });

// add event listener to search button
document.getElementById("search-btn").addEventListener("click", async () => {
  const searchText = document.getElementById("search-text").value;
  await ContentComponent.filter_data(searchText);
  await ContentComponent.render();
});

//add event listener to all recipes button
document.getElementById("my-recipes").addEventListener("click", async () => {
  await ContentComponent.init_data();
  await ContentComponent.render();
});
