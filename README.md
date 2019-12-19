# Interaction Programing - Project "Bookligo" React
This repository contains the code for project "Bookligo", which focuses on the Model-View-Controller paradigm using React Framework. 

## The API in this project
This application uses the [Google Books API](https://developers.google.com/books/docs/v1/using).


## Understanding the code
* [index.html](/index.html) - The default page for this application. 
* [src/data/BookligoModel.js](/src/data/BookligoModel.js) - This is a skeleton for the model of the 
application, it supports the functionality needed (number of books, total price of books, etc.). It also 
contains API methods that fetches the needed data for this application. For example, getAllBooks function is implemented using `fetch()` and Observer pattern is also implemented.
* [src/index.js](/src/index.js) - This is where React is started and where it calls the App - the root component.
* [src/index.css](/src/index.css) - Contains global styles for this application. 
* [src/App.js](/src/App.js) - This is the overall code (root component) of the application. It is responsible for initial setup of the 
App.
* [src/Components/Book.js](/src/Components/Book.js), [src/Components/Books.js](/src/Components/Books.js) etc. - contain the `.js` and `.css` file for each component. 
* [src/DetailsView.js](/src/DetailsView.js), [src/SearchView.js](/src/SearchView.js) etc. - contain the `.js` and `.css` file for each view containing certain components. 

