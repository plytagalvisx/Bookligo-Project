import React, {Component} from "react";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";
import "./Book.css";
import firebase, {auth} from "../../firebaseConfig/firebaseConfig";
import { NotificationManager } from 'react-notifications';

class Book extends Component {
    constructor(props) {
        super(props);
        let hash = window.location.href.split("/")[4];

        // We create the state to store the various statuses
        // e.g. API data loading or error
        // this.state har samma content som staten i redux store.
        this.state = {
            status: "LOADING",
            numberOfBooks: this.props.model.getNumberOfBooks(),
            bookDetails: '',
            bookId: hash,      // Dish ID hämtas via hash/href

            books: [],
            user: this.props.model.getCurrentUser(),
        };
        this.addToBookListButton = this.addToBookListButton.bind(this);
        this.addToShoppingCart = this.addToShoppingCart.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to call the API and get the data
    async componentDidMount() {
        this.props.model.addObserver(this);
        // when data is retrieved we update the state
        // this will cause the component to re-render
        let bookId = this.state.bookId;
        modelInstance
            .getBook(bookId)
            .then(book => {
                this.setState({
                    status: "LOADED",
                    bookDetails: book
                });
            })
            .catch(() => {
                this.setState({
                    status: "ERROR"
                });
            });

        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    // this is called when component is removed from the DOM
    // good place to remove observer
    componentWillUnmount() {
        this.props.model.removeObserver(this);
    }

    // in our update function we modify the state which will
    // cause the component to re-render
    update() {
        this.setState({
            numberOfBooks: this.props.model.getNumberOfBooks(),
        });
    }

    addToBookListButton() {
        this.props.model.addBookToList(this.state.bookDetails);
        NotificationManager.success('Book has been added to book list!', 'Successful!', 2000);
    }

    addToShoppingCart(e) {
        this.props.model.addBookToShoppingCart(this.state.bookDetails);

        //e.preventDefault();
        let booksRef = firebase.database().ref('books');

        let book = {
            bookDetails: this.state.bookDetails,
            user: this.state.user.displayName
        };

        if (book.bookDetails.saleInfo.saleability === "NOT_FOR_SALE") {
            NotificationManager.error("This book is not for sale.", 'Error!');
        } else {
            NotificationManager.success('Book has been added to shopping cart!', 'Successful!', 2000);
            booksRef.push(book);
        }

        return 0;
    }

    render() {
        let loader = null;
        let books = this.state.numberOfBooks;
        let book = this.state.bookDetails;
        let bookDisplay = null;

        // depending on the state we either generate
        // useful message to the user or show the selected
        // dish.
        switch (this.state.status) {
            case "LOADING":
                bookDisplay = <div className="spinner2"/>;
                break;
            case "LOADED":
                bookDisplay = (
                    <div key={book.id} id="details-container">
                        <div id="details-ingredients">
                           
                            <div className="book-information"> 
                                <img className="dish-image" alt=""
                                            src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>

                                <div id="details-ingredient-list">
                                    <div id="details-ingredient-header" className="ingredient">
                                        Purchase for: {books} people
                                    </div>
                                    <div key={book.id} className="details-ingredient-dish">
                                        <div className="ingredient"><span className="details-book-list-black-text">Title:</span> {book.volumeInfo.title}</div>
                                        <div><span className="details-book-list-black-text">Author:</span>  
                                            {book.volumeInfo.authors === undefined ? " Unknown" : book.volumeInfo.authors.map(author => 
                                                {return (<span key={Math.floor((Math.random() * 10000000))}> {author}</span>);}
                                            ).reduce((prev, curr) => [prev, ', ', curr])}
                                        </div>
                                        <div className="ingredient"><span className="details-book-list-black-text">Category:</span>
                                        <div
                                            className="ingredient">{(book.volumeInfo.hasOwnProperty('categories')) ? book.volumeInfo.categories[0] : book.volumeInfo['categories'] = []}</div>
                                        </div>
                                        <div>
                                            <span className="details-book-list-black-text">Publisher:</span> {book.volumeInfo.publisher} 
                                        </div>
                                        <div>
                                            <span className="details-book-list-black-text">Published Date:</span> {book.volumeInfo.publishedDate} 
                                        </div>
                                        <div>
                                            <span className="details-book-list-black-text">Language:</span> {book.volumeInfo.language}
                                        </div>
                                        <div>
                                            <span className="details-book-list-black-text">ISBN:</span> {book.volumeInfo.industryIdentifiers === undefined ? "" : book.volumeInfo.industryIdentifiers[1].identifier }
                                        </div>
                                        <div>
                                            <span className="details-book-list-black-text">Page Count:</span> {book.volumeInfo.pageCount} 
                                        </div>
                                        <div>
                                            <span className="details-book-list-black-text">Maturity Rating:</span> {book.volumeInfo.maturityRating} 
                                        </div>
                                        <div id="details-ingredient-footer">
                                            <span className="details-book-list-black-text">Price:</span> {(book.saleInfo.saleability === "FOR_SALE") ? book.saleInfo.retailPrice.amount + ' SEK' : '0'}
                                        </div>

                                    </div>
                                </div>
                            
                                 <div className="buttons">
                                    {this.state.user ?
                                            <button id="addToMenuBtn" className={`${"startBtn"} ${"shoppingCartBtn"}`} onClick={this.addToShoppingCart}>
                                                <div
                                                    className="amount">{(book.saleInfo.saleability === "FOR_SALE") ? 'Buy for ' + Math.round(book.saleInfo.retailPrice.amount * books) + ' SEK' : 'NOT FOR SALE'}
                                                </div>
                                            </button> :
                                            <button id="addToMenuBtn" className="startBtn">
                                                Login first here
                                            </button>
                                    }
                                        <button id="addToMenuBtn" className={`${"startBtn"} ${"bookListBtn"}`} onClick={this.addToBookListButton}>Add to
                                            my book list
                                        </button>
                                    <p id="buttons-book-rating">Average Rating: {book.volumeInfo.averageRating === undefined ? "0" : book.volumeInfo.averageRating}</p>
                                </div>
                            </div>
                        </div>
                        <div id="details-left-container">
                            <div className="details-heading">{book.volumeInfo.title}</div>
                            <div id="details-image-text" dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }}/>
                            <Link to="/search">
                                <button id="backToSearchBtn" className="backBtn"> &lt;&lt; Back to search</button>
                            </Link>
                        </div>
                    </div>
                    
                );
                break;
            default:
                bookDisplay = (
                    <div>
                        <p><b>Failed to load data, please try again</b></p>
                    </div>
                );
                break;
        }

        return (
            <div>
                <div className="outer-loader">{loader}</div>
                <div>{bookDisplay}</div>
            </div>
        );
    }

}

export default Book;

