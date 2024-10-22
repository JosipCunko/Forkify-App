import View from './View';
import icons from 'url:../../img/icons.svg'; //PARCEL V2
import { RESULTS_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**When button is clicked, , selects button that was clicked, and gets page that has to go to THEN switches pages*/
  addHandlerPageClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      console.log(e.target);
      const button = e.target.closest('.btn--inline');
      if (!button) return;
      const goToPage = +button.dataset.goto;
      handler(goToPage);
    });
  }
  _generateHTML() {
    const numPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);

    let curPage = this._data.page;

    //Page 1, there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto = ${
        curPage + 1
      } class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>`;
    }
    //Some page
    if (curPage < numPages) {
      return `
      <button data-goto = ${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${curPage - 1}</span>
      </button>

      <button data-goto = ${
        curPage + 1
      } class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>  
      `;
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto = ${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
      </button>
      `;
    }

    //Page 1, no other pages
    if (curPage === 1) {
      return '';
    }
  }
}
export default new PaginationView();
