# Interaction Programing - Project "Bookligo" React
This repository contains the code for project "Bookligo", which focuses on the Model-View-Controller paradigm using React Framework. 

Bookligo is an application that allows the user to search for books (provided by Google Books API), look up their information and save them in a "to-read" booklist. The application also allows the user to put books in their shopping cart for purchase (note that this feature is only a simulation) which will require the user to login/sign up to an account. 

The following describes features of the application; those that are marked have already been implemented otherwise it has yet to be completed:
- [X] Use React to implement the View components.
- [X] Allow the user to login/sign up using Firebase and its authentication.
- [ ] Allow the user to search for and view information of a specific book.
- [ ] Implement a simulated shopping cart, where the user can add or remove items from the cart.
- [X] Implement a book-list, where the user can add or delete books from the list.
- [X] The user can navigate through the application.
- [ ] The user should be able to comment and/or review a specific book. 
- [ ] Data should be persisted even after reloading the page.

## The API in this project
This application uses the [Google Books API](https://developers.google.com/books/docs/v1/using).


## Understanding the code
* [index.html](/public/index.html) - The default page for this application. 
* [src/data/BookligoModel.js](/src/data/BookligoModel.js) - This is a skeleton for the model of the 
application, it supports the functionality needed (number of books, total price of books, etc.). It also 
contains API methods that fetches the needed data for this application. For example, getAllBooks function is implemented using `fetch()` and Observer pattern is also implemented.
* [src/index.js](/src/index.js) - This is where React is started and where it calls the App - the root component.
* [src/index.css](/src/index.css) - Contains global styles for this application. 
* [src/App.js](/src/App.js) - This is the overall code (root component) of the application. It is responsible for initial setup of the 
App.
* [src/Components/Book.js](/src/Components/Book/Book.js), [src/Components/Books/Books.js](/src/Components/Books.js) etc. - contain the `.js` and `.css` file for each component. 
* [src/DetailsView.js](/src/DetailsView/DetailsView.js), [src/SearchView.js](/src/SearchView/SearchView.js) etc. - contain the `.js` and `.css` file for each view containing certain components. 

