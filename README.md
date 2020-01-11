# Interaction Programing - Project "Bookligo" React

This repository contains the code for project "Bookligo", which focuses on the Model-View-Controller paradigm using React Framework.

Bookligo is an application that allows the user to search for books (provided by Google Books API), look up their information and save them in a "to-read" booklist. The application also allows the user to put books in their shopping cart for purchase (note that this feature is only a simulation) which will require the user to login/sign up to an account.

The following describes features of the application as well as the implementation status:

| Feature                                         | Description | Status |
| :---------------------------------------------- | :---------- | :---------- |
| Use React framework to implement View components |             | Done        |
| Implement login/sign up system | Implement the login/sign up system using Firebase and its authentication, where the user is able to create or login into an account using their email and a password. | Done |
| Ability to search and view a specific book's information | The application should fetch the required information from the API and display that information in a usable way for the user. The minimum required information is the book's title, author and publication. | Done |
| Ability to add/remove items from shopping cart | The user should be able to add or remove items that they wish to "purchase" in the shopping cart - note that this feature is only a simulation of a shopping cart and does not actually execute any real financial transactions. For this, it is required that a structure for the shopping cart is decided and implemented in the model. | Done |
| Ability to add/remove items from book-list | The book-list is intended to store the books that the user wishes to read in the future.  For this, it is required that a structure for the book-list is decided and implemented in the model. | Done |
| Ability to navigate through the application | The user should be able to navigate through the application in a manner that is intuitive for the user. | Done |
| Ability to leave a review/comment for a specific book | To review a specific book, the application provides the user to rate the book with stars where the more stars a book has the better it is. Currently, the maximum number of stars that a user can give for each book is 5. | Done |
| Data should be persisted even after page reload | Data that has been inputted by the user should not disappear when the page refreshes/reloads. More specifically, the page should stay the same for the user even after reloading. For this, either local storage or cookies can be used. | Done |
| Data specific for each account should be persisted/saved | The user should be able to log in to an account and find the ratings as well as the items in their book-list and shopping cart has remained. | Done |




## The API in this project

This application uses the [Google Books API](https://developers.google.com/books/docs/v1/using).

## Understanding the code

* [public/index.html](/public/index.html) - The default page for this application.
* [src/data/BookligoModel.js](/src/data/BookligoModel.js) - This is a skeleton for the model of the
application, it supports the functionality needed (number of books, total price of books, etc.). It also
contains API methods that fetches the needed data for this application. For example, getAllBooks function is implemented using `fetch()` and Observer pattern is also implemented.
* [src/index.js](/src/index.js) - This is where React is started and where it calls the App - the root component.
* [src/index.css](/src/index.css) - Contains global styles for this application.
* [src/App.js](/src/App.js) - This is the overall code (root component) of the application. It is responsible for initial setup of the
App.
* [src/Components/Book/Book.js](/src/Components/Book/Book.js), [src/Components/Books/Books.js](/src/Components/Books/Books.js) etc. - contain the `.js` and `.css` file for each component.
* [src/DetailsView/DetailsView.js](/src/DetailsView/DetailsView.js), [src/SearchView/SearchView.js](/src/SearchView/SearchView.js) etc. - contain the `.js` and `.css` file for each view containing certain components.

## How to setup this Project

### `npm install` 
Installs all project dependencies

### `npm start`
compiles and launches the project development server

### `npm run build` 
builds the project into a deployable artifact.