import React, {Component} from "react";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";
import "./Book.css";
import firebase, {auth} from "../../firebaseConfig/firebaseConfig";
import { NotificationManager } from 'react-notifications';
import StarRatings from 'react-star-ratings';

class Book extends Component {
    constructor(props) {
        super(props);
        let hash = window.location.href.split('/').pop().split('?')[0];

        // We create the state to store the various statuses
        // e.g. API data loading or error
        // this.state har samma content som staten i redux store.
        this.state = {
            status: "LOADING",
            numberOfBooks: this.props.model.getNumberOfBooks(),
            bookDetails: '',
            bookID: hash,       // Book ID hämtas via hash/href

            books: [],
            user: '',

            review: '',
            rating: 0,
            booksFromDbWithReviews: [],
        };
        this.addToBookListButton = this.addToBookListButton.bind(this);
        this.addToShoppingCart = this.addToShoppingCart.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.addBookReview = this.addBookReview.bind(this);

        this.changeRating = this.changeRating.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to call the API and get the data
    async componentDidMount() {
        this.props.model.addObserver(this);
        // when data is retrieved we update the state
        // this will cause the component to re-render
        let bookId = this.state.bookID;
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

        const booksRef = await firebase.database().ref("reviews");
        booksRef.once('value', (snap) => {
            console.log("books: ", snap.val());
            let books = snap.val();
            let newState = [];
            for (let book in books) {
                newState.push({
                    id: book,
                    review: books[book].reviewDetails.review,
                    user: books[book].user,
                    rating: books[book].reviewDetails.rating,
                    reviewId: books[book].reviewDetails.bookId,
                });
            }
            this.setState({
                booksFromDbWithReviews: newState
            });
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
        let bookListRef = firebase.database().ref('bookList');
        const bookInList = {
            bookDetails: this.state.bookDetails,
            user: this.state.user.displayName,
        };
        bookListRef.push(bookInList);

        NotificationManager.success('Book has been added to book list!', 'Successful!', 2000);
    }

    addToShoppingCart(e) {
        let booksRef = firebase.database().ref('books');

        let book = {
            bookDetails: this.state.bookDetails,
            user: this.state.user.displayName,
        };

        if (book.bookDetails.saleInfo.saleability === "NOT_FOR_SALE") {
            NotificationManager.error("This book is not for sale.", 'Error!');
        } else {
            NotificationManager.success('Book has been added to shopping cart!', 'Successful!', 2000);
            booksRef.push(book);
        }

        return 0;
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addBookReview() {
        let booksWithReviewsRef = firebase.database().ref('reviews');

        let bookWithReviews = {
            bookDetails: this.state.bookDetails,
            user: this.state.user.displayName,
            reviewDetails: this.state.reviewDetails = {
                review: this.state.review,
                rating: this.state.rating,
                bookId: this.state.bookID,
            }};
        booksWithReviewsRef.push(bookWithReviews);
    }

    changeRating(newRating, name) {
        this.setState({
            rating: newRating
        });
    }

    goBack(){
        this.props.history.goBack();
    }

    render() {
        let loader = null;
        let books = this.state.numberOfBooks;
        let book = this.state.bookDetails;
        let bookDisplay = null;
        let bookReviews;
        let bookID = this.state.bookID;

        bookReviews = this.state.booksFromDbWithReviews.map(book => (
                        <div key={book.id}>
                            { book.review && book.reviewId === bookID ?
                                <div>
                                    <p>Review: {book.review}</p>
                                    <p>Posted by: <strong>{book.user}</strong></p>
                                    <StarRatings
                                        rating={book.rating}
                                        starDimension="40px"
                                        starSpacing="15px"
                                    />
                                </div> : "" }
                        </div>
            ));

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
                                            Login first
                                        </button>
                                    }
                                    <button id="addToMenuBtn" className={`${"startBtn"} ${"bookListBtn"}`} onClick={this.addToBookListButton}>Add to
                                        my book list
                                    </button>
                                    {/*<p id="buttons-book-rating">Average Rating: {book.volumeInfo.averageRating === undefined ? "0" : book.volumeInfo.averageRating}</p>*/}
                                    <p id="buttons-book-rating">Average Rating: {book.volumeInfo.averageRating === undefined ? 0 : book.volumeInfo.averageRating + (this.state.rating)/2}</p>
                                    <StarRatings
                                        rating={book.volumeInfo.averageRating === undefined ? 0 : book.volumeInfo.averageRating + (this.state.rating)/2}
                                        starDimension="40px"
                                        starSpacing="15px"
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="details-left-container">
                            <div className="details-heading">{book.volumeInfo.title}</div>
                            <div id="details-image-text" dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }}/>

                            <div className="details-heading">Reviews: </div>
                            <div>
                                {this.state.user ?
                                <form onSubmit={this.addBookReview}>
                                    <input type="text" name="review" placeholder="Add your thoughts" onChange={this.handleChange} value={this.state.review} />
                                    <button>Add review</button>
                                    <StarRatings
                                        rating={this.state.rating}
                                        starRatedColor="blue"
                                        changeRating={this.changeRating}
                                        numberOfStars={5}
                                        name='rating'
                                    />
                                </form>
                                    : "You have to login first to add and view reviews"}
                            </div>
                            <div>
                                {bookReviews}
                            </div>
                            <Link to="/search">
                                <button id="backToSearchBtn" className="backBtn" onClick={this.goBack}> &lt;&lt; Back to search</button>
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