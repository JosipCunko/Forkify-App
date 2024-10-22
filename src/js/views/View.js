import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**PUBLIC
   * Renders data in parentElement of every class, needs generateHTML method which is different in all of view classes
   * @param data */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const html = this._generateHTML();
    console.log('thisdata from render method', this._data);

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  /**Recevies data, renders all of recipeView but exluding the nodes that didn't change */
  update(data) {
    this._data = data;
    const html = this._generateHTML();

    const newDOM = document.createRange().createContextualFragment(html);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        //Atributes of element such as class and dataset
        //console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
          // console.log(attr.name);
          // console.log(attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  /**PUBLIC
   * Renders spinner in a parentElement */
  renderSpinner() {
    const htmlSpinnerStructure = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', htmlSpinnerStructure);
  }
  /**PUBLIC
   * Renders errorMessage in a parentElement */
  renderError(errMessage = this._errorMessage) {
    const HTMLerror = `
    <div class="error">
      <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
      </div>
      <p>${errMessage}</p>
    </div> `;
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', HTMLerror);
  }
  /**PUBLIC
   * Renders custom message in a parentElement */
  renderMessage(message = this._succesMessage) {
    const HTMLerror = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', HTMLerror);
  }
}
