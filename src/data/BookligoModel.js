import ObservableModel from "./ObservableModel";
import * as Constants from "./googlebooksapiConfig";

class BookligoModel extends ObservableModel {
  constructor() {
    super();
    this.state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {
      numberOfBooks: 0,
      bookList: [],
      shoppingCart: [],
      price: 0,
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
    if(num < 0)
      num = 0;
    this.state.numberOfBooks = num;
    this.updateLocalStorage();
    this.notifyObservers("A number of books has changed");
  }

  //Returns the book that is on the list for selected type
  /*getSelectedBooks(type) {
    return this.state.bookList.filter(book => book.dishTypes.includes(type));
  }*/

  //Returns all the books on the list.
  getFullList() {
    return this.state.bookList;
  }

  //Returns all the books on the shopping cart.
  getFullShoppingCart() {
    return this.state.shoppingCart;
  }

  //Returns the total price of the shopping cart (price per book multiplied by number of books).
  getTotalShoppingCartPrice() {
    let prices = this.state.shoppingCart.map(book => {
      if(book.saleInfo.saleability === "FOR_SALE")
      {
        return book.saleInfo.retailPrice.amount;
      }
      else {
        return 0;
      }
    });
    let noOfBooks = this.getNumberOfBooks();
    let sum = prices.reduce((total, amount) => total + amount, 0);
    return sum*noOfBooks;
  }

  //Returns all ingredients for all the dishes on the menu.
  /*getAllIngredients() {
    return this.state.bookList.map(book => book.extendedIngredients.map(name => name.name)).flat();
  }*/

  //Returns the total price of the list (price per book multiplied by number of books).
  getTotalMenuPrice() {
    let prices = this.state.bookList.map(book => {
      if(book.saleInfo.saleability === "FOR_SALE")
      {
        return book.saleInfo.retailPrice.amount;
      }
      else {
        return 0;
      }
    });
    let noOfBooks = this.getNumberOfBooks();
    let sum = prices.reduce((total, amount) => total + amount, 0);
    return sum*noOfBooks;
  }

  //Adds the passed book to the list.
  addBookToList(book) {
    let bool;
    this.state.bookList.forEach(bookInList => {
      if(bookInList.id === book.id)
        bool = true;
    });

    if (!bool) {
      this.state.bookList.push(book);
      this.updateLocalStorage();
      this.notifyObservers("Book added");
    }
    else
      alert("Book already in the list.");
  }

  //Removes book with specified id from list
  removeBookFromList(id) {
    this.state.bookList = this.state.bookList.filter(book => book.id !== id);
    this.updateLocalStorage();
    this.notifyObservers("Book removed");
    console.log(this.getFullList());
  }

  // API methods

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
