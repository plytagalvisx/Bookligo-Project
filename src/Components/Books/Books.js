import React, {Component} from "react";
import modelInstance from "../../data/DinnerModel";
import {Link} from "react-router-dom";
import "./Books.css";
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
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.pressSearchButton = this.pressSearchButton.bind(this);
        this.handleMissingProperties = this.handleMissingProperties.bind(this);
        this.handleSortedBooks = this.handleSortedBooks.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to call the API and get the data
    async componentDidMount() {
        // when data is retrieved we update the state
        // this will cause the component to re-render
        let query = this.state.query;
        await modelInstance
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

    handleSearch = debounce((query) => {
        this.setState({query});
        this.setState({status: "LOADING"}, this.componentDidMount);
    }, 1000)

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
            }
            else if (imageLinksIsUndefined) {
                book.volumeInfo['imageLinks'] = {
                    thumbnail: 'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:'}
            }
            else if (averageRatingIsUndefined) {
                book.volumeInfo['averageRating'] = '0';
            }

            console.log(book.saleInfo.saleability);


            return book;
        });

        return filledProperties;
    }

    handleSortedBooks() {
        let sortedBooks = this.state.books.sort((a, b) => {
            let isMostPopularBooks = (this.state.sortBooks === "Most Popular");
            let isNewestBooks = (this.state.sortBooks === "Publication date, new to old");
            let isOldestBooks = (this.state.sortBooks === "Publication date, old to new");

            if (isMostPopularBooks) {
                return parseFloat(b.volumeInfo.averageRating) - parseFloat(a.volumeInfo.averageRating)
            }
            else if (isNewestBooks) {
                return parseInt(b.volumeInfo.publishedDate.substring(0, 4)) - parseInt(a.volumeInfo.publishedDate.substring(0, 4))
            }
            else if (isOldestBooks) {
                return parseInt(a.volumeInfo.publishedDate.substring(0, 4)) - parseInt(b.volumeInfo.publishedDate.substring(0, 4))
            }
        });

        return sortedBooks;
    }

    render() {
        let booksList = null;
        let query = this.state.query;
        let queryExists = (!query);
        let sortedBooks = this.handleSortedBooks();

        switch (this.state.status) {
            case "LOADING":
                booksList = <em>Loading...</em>;
                break;
            case "LOADED":
                booksList = sortedBooks.map(book => (
                    <Link key={book.id} to={"/details/" + book.id}>
                        <div id="dishes-items">
                            <div className="dish">
                                <img className="dish-image" alt=""
                                     src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>
                                <div className="dish-text">
                                    <p>Title: {book.volumeInfo.title}</p>
                                    <p>Published: {book.volumeInfo.publishedDate}</p>
                                    <p>Author: {book.volumeInfo.authors} </p>
                                    <p>Average Rating: {book.volumeInfo.averageRating}</p>
                                    <p>{book.saleInfo.saleability}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ));
                break;
            default:
                booksList =
                    <div id="updateTitle">{queryExists ? 'Please enter something into the field above to start a search.' : ''}</div>
                break;
        }

        return (
            <div className="Dishes">
                <h3>Books</h3>
                <Link to="/bookList">
                    <button>My Book List</button>
                </Link>
                <input id="inputDishTitle" type="text" value={this.state.query}
                       onChange={e => this.handleSearch(e.target.value)}/>
                <button type="submit" onClick={this.pressSearchButton}>Search</button>
                <label className="space">
                    <select id="selectTypeDish" value={this.state.type} onChange={this.handleSort}>
                        <option>Sort</option>
                        <option>Most Popular</option>
                        <option>Publication date, old to new</option>
                        <option>Publication date, new to old</option>
                    </select>
                </label>
                <div className="displayDishes">
                    {booksList}
                </div>
            </div>
        );
    }
}

export default Books;
