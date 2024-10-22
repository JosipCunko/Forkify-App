class SearchView {
  _parentElement = document.querySelector('.search');
  /**Gets our input from a search field */
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clear();
    return query;
  }
  /**Handler function, when we click submit button
   * @param handlerFunction
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  _clear() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}
export default new SearchView();
