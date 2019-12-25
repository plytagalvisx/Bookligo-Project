import React, {Component} from "react";
import modelInstance from "../../data/BookligoModel";
import {Link} from "react-router-dom";
import "./Books.css";
import "../../App.css";
import {debounce} from "lodash";

class Books extends Component {
    constructor(props) {
        super(props);
        // We create the state to store the various statuses
        // e.g. API data loading or error
        this.state = {
            status: "LOADING",
            query: '',
            sortBooks: '',
            books: [],
            type: ''
        };
        
        this.delayedCallback = debounce(this.apiCall, 800);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.pressSearchButton = this.pressSearchButton.bind(this);
        this.handleMissingProperties = this.handleMissingProperties.bind(this);
        this.handleSortedBooks = this.handleSortedBooks.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to call the API and get the data
    componentDidMount() {
        // when data is retrieved we update the state
        // this will cause the component to re-render
        let query = this.state.query;
        modelInstance
            .getAllBooks(query)
            .then(books => {
                let withFilledProperties = this.handleMissingProperties(books);
                this.setState({
                    status: "LOADED",
                    books: withFilledProperties  //books.items
                });
            })
            .catch(() => {
                this.setState({
                    status: "ERROR"
                });
            });
    }

    handleSearch(event) {
        event.persist();
        this.delayedCallback(event);
    }
    
    apiCall = (event) => {
        console.log(event.target.value);
        this.setState({query: event.target.value});
        this.setState({status: "LOADING"}, this.componentDidMount);
    } 

    /*handleSearch(e) {
        this.setState({query: e.target.value});
    }*/

    pressSearchButton(e) {
        this.setState({status: "LOADING"}, this.componentDidMount);
    }

    handleSort(event) {
        console.log(event.target.value);
        this.setState({sortBooks: event.target.value});
        this.setState({type: event.target.value});
    }

    // We give default values to the missing properties of the book object inside the book.items array.
    handleMissingProperties(books) {
        let filledProperties = books.items.map((book) => {
            let publishedDateIsUndefined = (book.volumeInfo.hasOwnProperty('publishedDate') === false);
            let imageLinksIsUndefined = (book.volumeInfo.hasOwnProperty('imageLinks') === false);
            let averageRatingIsUndefined = (book.volumeInfo.hasOwnProperty('averageRating') === false);

            if (publishedDateIsUndefined) {
                book.volumeInfo['publishedDate'] = '0000';
            } else if (imageLinksIsUndefined) {
                book.volumeInfo['imageLinks'] = {
                    thumbnail: 'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:'
                }
            } else if (averageRatingIsUndefined) {
                book.volumeInfo['averageRating'] = '0';
            }

            return book;
        });

        return filledProperties;
    }

    handleSortedBooks() {
        let sortedBooks = this.state.books.sort((book1, book2) => {
            let isMostPopularBooks = (this.state.sortBooks === "Most Popular");
            let isNewestBooks = (this.state.sortBooks === "Publication date, new to old");
            let isOldestBooks = (this.state.sortBooks === "Publication date, old to new");

            if (isMostPopularBooks) {
                return parseFloat(book2.volumeInfo.averageRating) - parseFloat(book1.volumeInfo.averageRating)
            } else if (isNewestBooks) {
                return parseInt(book2.volumeInfo.publishedDate.substring(0, 4)) - parseInt(book1.volumeInfo.publishedDate.substring(0, 4))
            } else if (isOldestBooks) {
                return parseInt(book1.volumeInfo.publishedDate.substring(0, 4)) - parseInt(book2.volumeInfo.publishedDate.substring(0, 4))
            }
        });

        return sortedBooks;
    }

    render() {
        let booksList = null;
        let loader = null;
        let query = this.state.query;
        let queryExists = (!query);
        let sortedBooks = this.handleSortedBooks();

        switch (this.state.status) {
            case "LOADING":
                loader = <div className="spinner"/>;
                break;
            case "LOADED":
                booksList = sortedBooks.map(book => (
                    <Link key={book.id} to={"/details/" + book.id}>
                        <div class="dishes-items">
                            <div className="dish">
                                <img className="dish-image" alt=""
                                     src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>
                                <div className="dish-text">
                                    <p className="book-text-title">{book.volumeInfo.title}</p>
                                    <p className="book-text-author">by {book.volumeInfo.authors.map(author => 
                                            {return (<span key={Math.floor((Math.random() * 10000000))}>{author}</span>);}
                                        )}
                                    </p>
                                    <p className="book-text-info"> {book.volumeInfo.publishedDate}, {book.volumeInfo.language}, 
                                            ISBN {book.volumeInfo.industryIdentifiers[1] === undefined ? "" : book.volumeInfo.industryIdentifiers[1].identifier }
                                    </p>
                                    <p className="book-text-sale">{book.saleInfo.saleability}</p>   
                                </div>
                                <p className="book-rating">Average Rating: {book.volumeInfo.averageRating}</p>
                            </div>
                        </div>
                    </Link>
                ))
                break;
            default:
                booksList =
                    <div id="updateTitle">
                        {queryExists ? 'Please enter something into the field above to start a search.' : ''}
                    </div>
                break;
        }

        return (
                <div className="Dishes">
                    <div className="searchbar">
                        <label className="space">
                            <select id="selectTypeDish" value={this.state.type} onChange={this.handleSort}>
                                <option>Sort</option>
                                <option>Most Popular</option>
                                <option>Publication date, old to new</option>
                                <option>Publication date, new to old</option>
                            </select>
                        </label>
                        <input id="inputDishTitle" type="text" placeholder="Search.." defaultValue={this.state.query}
                            onChange={e => this.handleSearch(e)}/>
                        <button type="submit" onClick={this.pressSearchButton}>&#128269;</button>
                    </div>
                    <div className="outer-loader">{loader}</div>
                    <div className="displayDishes">{booksList}</div>
                </div>
        );
    }
}

export default Books;
