import View from './View.js';
import icons from 'url:../../img/icons.svg';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for query';
  _succesMessage = 'Recipe found';

  _generateHTML() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(result => {
        console.log(result);
        return `
        <li class="preview">
            <a class="preview__link ${
              id === result.id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}...</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  this._data.key ? '' : 'hidden'
                }">
                  <svg>
                  <use href="src/img/icons.svg#icon-user"></use>
                  </svg>
               </div>
            </div>
            </a>
          </li>`;
      })
      .join('');
  }
}
export default new SearchResultsView();
