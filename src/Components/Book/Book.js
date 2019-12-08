import React, {Component} from "react";
import {Link} from "react-router-dom";
import modelInstance from "../../data/DinnerModel";
import "./Book.css";

class Book extends Component {
    constructor(props) {
        super(props);
        let hash = window.location.href.split("/")[4];

        // We create the state to store the various statuses
        // e.g. API data loading or error
        // this.state har samma content som staten i redux store.
        this.state = {
            status: "LOADING",
            numberOfGuests: this.props.model.getNumberOfGuests(),
            bookDetails: '',
            bookId: hash      // Dish ID hämtas via hash/href
        };
        this.addToMenuButton = this.addToMenuButton.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to call the API and get the data
    componentDidMount() {
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
            numberOfGuests: this.props.model.getNumberOfGuests()
        });
    }

    addToMenuButton() {
        let book = this.state.bookDetails;
        if (book.saleInfo.saleability === "NOT_FOR_SALE") {
            alert("This book is not for sale.");
        }
        else {
            this.props.model.addDishToMenu(this.state.bookDetails);
        }

        return 0;
    }

    render() {
        let guests = this.state.numberOfGuests;
        let book = this.state.bookDetails;
        let bookDisplay = null;

        let hash = window.location.href.split("/")[4];
        console.log(hash);
        console.log(book);

        // depending on the state we either generate
        // useful message to the user or show the selected
        // dish.
        switch (this.state.status) {
            case "LOADING":
                bookDisplay = <em>Loading...</em>;
                break;
            case "LOADED":
                bookDisplay = (
                        <div key={book.id} id="details-container">
                            <div id="details-ingredients">
                                <div id="details-ingredient-header" className="ingredient">Purchase
                                    for: {guests} people
                                </div>
                                <div className="details-line"></div>
                                <div id="details-ingredient-list">
                                    <div key={book.id} className="details-ingredient-dish">
                                        <div className="amount">{(book.saleInfo.saleability === "FOR_SALE") ? book.saleInfo.retailPrice.amount + ' SEK' : 'NOT FOR SALE' }</div>
                                        <div className="ingredient">{book.volumeInfo.title}</div>
                                    </div>
                                </div>
                                <div className="details-line"></div>
                                <div id="details-ingredient-footer">{(book.saleInfo.saleability === "FOR_SALE") ? Math.round(book.saleInfo.retailPrice.amount * guests) + ' SEK' : '' }</div>
                                <Link to="/bookList">
                                    <button id="addToMenuBtn" className="startBtn" onClick={this.addToMenuButton}>Add to
                                        list</button>
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
                                {/*<div className="details-text">{book.searchInfo.textSnippet}</div>*/}
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
                <div>{bookDisplay}</div>
            </div>
        );
    }
}

export default Book;

