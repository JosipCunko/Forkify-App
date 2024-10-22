import View from './View.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks. Find a recipe that you like and bookmark it!';
  _succesMessage = 'Bookmarks loaded'; // not used

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

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
                
              </div>
            </a>
          </li>`;
      })
      .join('');
  }
}
export default new BookmarksView();
