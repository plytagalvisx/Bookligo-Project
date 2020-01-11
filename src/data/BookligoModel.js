import ObservableModel from "./ObservableModel";
import * as Constants from "./googlebooksapiConfig";

class BookligoModel extends ObservableModel {
  constructor() {
    super();
    this.state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {
      numberOfBooks: 0,
    };
  }

  updateLocalStorage() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  /**
   * Get the number of books
   * @returns {number}
   */
  getNumberOfBooks() {
    return this.state.numberOfBooks;
  }

  /**
   * Set number of books
   * @param {number} num
   */
  setNumberOfBooks(num) {
    if(num <= 0)
      num = 1;
    this.state.numberOfBooks = num;
    this.updateLocalStorage();
    this.notifyObservers("A number of books has changed");
  }

  // API methods:

  // Returns a book of specific ID
  getBook(id) {
    if(!id)
      id = '';

    const url = `${Constants.ENDPOINT}/${id}`;
    return fetch(url, Constants.httpOptions).then(this.processResponse);
  }

  /**
   * Do an API call to the search API endpoint.
   * @returns {Promise<any>}
   */
  getAllBooks(query) {
    const url = `${Constants.ENDPOINT}?q=${query}`;
    return fetch(url, Constants.httpOptions).then(this.processResponse);
  }

  processResponse(response) {
    if (response.ok) {
      return response.json();
    }
    throw response;
  }
}

// Export an instance of BookligoModel
const modelInstance = new BookligoModel();
export default modelInstance;
