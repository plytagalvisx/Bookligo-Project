import ObservableModel from "./ObservableModel";
import * as Constants from "./apiConfig";

class DinnerModel extends ObservableModel {
  constructor() {
    super();
    this.state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {
      numberOfGuests: 0,
      bookList: [],
      price: 0,
    };
  }

  updateLocalStorage() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  /**
   * Get the number of guests
   * @returns {number}
   */
  getNumberOfGuests() {
    return this.state.numberOfGuests;
  }

  /**
   * Set number of guests
   * @param {number} num
   */
  setNumberOfGuests(num) {
    if(num < 0)
      num = 0;
    this.state.numberOfGuests = num;
    this.updateLocalStorage();
    this.notifyObservers("a number of guests has changed");
  }

  //Returns the dish that is on the menu for selected type
  getSelectedDishes(type) {
    return this.state.bookList.filter(book => book.dishTypes.includes(type));
  }

  //Returns all the dishes on the menu.
  getFullMenu() {
    return this.state.bookList;
  }

  //Returns all ingredients for all the dishes on the menu.
  getAllIngredients() {
    return this.state.bookList.map(book => book.extendedIngredients.map(name => name.name)).flat();
  }

  //Returns the total price of the menu (price per serving of each dish multiplied by number of guests).
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
    let guests = this.getNumberOfGuests();
    let sum = prices.reduce((total, amount) => total + amount, 0);
    return sum*guests;
  }

  //Adds the passed dish to the menu.
  addDishToMenu(book) {
    let bool;
    this.state.bookList.forEach(bookInList => {
      if(bookInList.id === book.id)
        bool = true;
    });

    if (!bool) {
      this.state.bookList.push(book);
      this.updateLocalStorage();
      this.notifyObservers("book added");
    }
    else
      alert("Book already in the list.");
  }

  //Removes dish with specified id from menu
  removeDishFromMenu(id) {
    let book = this.getBook(id);
    this.state.bookList.pop(book);
    this.updateLocalStorage();
    this.notifyObservers("Book removed");
    console.log(this.getFullMenu());
  }

  // API methods

  // Returns a dish of specific ID
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

// Export an instance of DinnerModel
const modelInstance = new DinnerModel();
export default modelInstance;
