import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE } from './CONFIG.JS';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { API_KEY } from './config.js';

/**Web's data */
export const state = {
  recipe: {},
  search: {
    results: [],
    resultsPerPage: 10,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // state  recipe object
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // if recipe.key doesnt exist, spread operator returns nothing. Otherwise creates new property which has key
  };
};

/** Changes state's recipe object to an recipe information with different id
 * @param id
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`); //When we search our recipe in search bar, it should appear becaouse of ?key=API_KEY
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

/** Gets results of our query, lists of recipes*/
export const loadSearchResults = async function (query) {
  try {
    const results = await AJAX(`${API_URL}?search=${query}@key=${API_KEY}`);

    state.search.results = results.data.recipes.map(recp => {
      return {
        id: recp.id,
        title: recp.title,
        publisher: recp.publisher,
        image: recp.image_url,
        ...(recp.key && { key: recp.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
/**Search results per page */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  console.log(state.recipe, 'state.recipe!!!');
  state.recipe.ingredients.forEach(ing => {
    // console.log(ing, ing.quantity);
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // console.log(ing, ing.quantity);
    debugger;
    state.recipe.servings = newServings;
  });
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark to bookmarks array
  state.bookmarks.push(recipe);

  //Mark cur recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  //Find element and delete it from bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark cur recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

clearBookmarks = function () {
  localStorage.removeItem('bookmarks');
};

const init = function () {
  const storageBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if (storageBookmarks) state.bookmarks = storageBookmarks;
};
init();
//clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  //look at object that api sent
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry => entry[0].startsWith('ingredient') && entry[1] // entry[1] cant be ""
      )
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) throw new Error('Wrong ingredient format!'); //After this, function immediatlly exits

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};
