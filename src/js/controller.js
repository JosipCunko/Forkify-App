import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

console.log('recipeView class instance', recipeView);

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

//if (module.hot) module.hot.accept();

/**Takes id of an URL, renders spinner, gets recipe information of that id, and renders it to recipeView */
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0 Update results view to mark selected search result
    searchResultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    //1 loading recipe
    await model.loadRecipe(id);

    //2 Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

/**Gets our search input, gets all recipes and renders it to the searchResultsView  */
const controlSearchResults = async function () {
  try {
    searchResultsView.renderSpinner();

    //1 Gets input value
    const query = searchView.getQuery();
    if (!query) return;

    // 2 Gets list of recipes
    await model.loadSearchResults(query);

    //Renders results

    searchResultsView.render(model.getSearchResultsPage());

    //Renders pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

/** Goes to differrent pages, renders the new recipes*/
const controlPages = function (goToPage) {
  //Render new results
  searchResultsView.render(model.getSearchResultsPage(goToPage));

  //Render new pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update recipe servings in state
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  //1 add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // for checking bookmarked property on recipe => console.log(model.state.recipe);

  //2 Update recipe view
  recipeView.update(model.state.recipe);

  //3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    recipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Succes message
    addRecipeView.renderMessage();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleHiddenClass();
    }, 2500);

    //Render bookmarks because added recipe isnt immedieatly put there
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`); //Change URL without reloading page
    //window.history.back   <== another method
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

/**Initialization of button event listeners and handlers */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPageClick(controlPages);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
