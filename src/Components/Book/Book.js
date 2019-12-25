import React, {Component} from "react";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";
import "./Book.css";
import firebase, {auth} from "../../firebaseConfig/firebaseConfig";

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
        this.addBookToShoppingCart = this.addBookToShoppingCart.bind(this);
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
    }

    addBookToShoppingCart(e) {
        //e.preventDefault();
        let booksRef = firebase.database().ref('books');

        let book = {
            bookDetails: this.state.bookDetails,
            user: this.state.user.displayName
        };

        if (book.bookDetails.saleInfo.saleability === "NOT_FOR_SALE") {
            alert("This book is not for sale.");
        } else {
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
                            <div id="details-ingredient-header" className="ingredient">Purchase
                                for: {books} people
                            </div>
                            <div className="details-line"></div>
                            <div id="details-ingredient-list">
                                <div key={book.id} className="details-ingredient-dish">
                                    <div
                                        className="amount">{(book.saleInfo.saleability === "FOR_SALE") ? book.saleInfo.retailPrice.amount + ' SEK' : 'NOT FOR SALE'}</div>
                                    <div className="ingredient">Title: {book.volumeInfo.title}</div>
                                    <div className="ingredient">Category:</div>
                                    <div
                                        className="ingredient">{(book.volumeInfo.hasOwnProperty('categories')) ? book.volumeInfo.categories[0] : book.volumeInfo['categories'] = []}</div>
                                </div>
                            </div>
                            <div className="details-line"></div>
                            <div
                                id="details-ingredient-footer">{(book.saleInfo.saleability === "FOR_SALE") ? Math.round(book.saleInfo.retailPrice.amount * books) + ' SEK' : ''}</div>
                            <Link to="/bookList">
                                <button id="addToMenuBtn" className="startBtn" onClick={this.addToBookListButton}>Add to
                                    my book list
                                </button>
                            </Link>
                            <Link to="/shoppingCart">
                                {this.state.user ?
                                    <button id="addToMenuBtn" className="startBtn" onClick={this.addBookToShoppingCart}>
                                        Add to shopping cart
                                    </button> :
                                    <button id="addToMenuBtn" className="startBtn">
                                        Login first here
                                    </button>
                                }
                            </Link>
                        </div>
                        <div id="details-left-container">
                            <div className="details-heading">{book.volumeInfo.title}</div>
                            <img className="dish-image" alt=""
                                 src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>

                            <div id="details-image-text">{book.volumeInfo.description}</div>
                            <Link to="/search">
                                <button id="backToSearchBtn" className="backBtn">Back to search</button>
                            </Link>
                        </div>
                        <div id="details-preparation">
                            <div className="details-heading">Search Info</div>
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

