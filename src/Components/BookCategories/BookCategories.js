import React, {Component} from "react";
import modelInstance from "../../data/BookligoModel";
import {Link} from "react-router-dom";
import "./BookCategories.css";
import "../../App.css";

class BookCategories extends Component {
    constructor(props) {
        super(props);
        // We create the state to store the various statuses
        // e.g. API data loading or error
        this.state = {
            status: "LOADING",
            sortBooks: '',
            books: [],
            type: '',
            bookCategory: ''
        };
        this.handleSort = this.handleSort.bind(this);
        this.handleMissingProperties = this.handleMissingProperties.bind(this);
        this.handleSortedBooks = this.handleSortedBooks.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to call the API and get the data
    componentDidMount() {
        // when data is retrieved we update the state
        // this will cause the component to re-render
        let subject = this.state.bookCategory;
        modelInstance
            .getAllBooks(subject)
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
            return 0;
        });

        return sortedBooks;
    }

    handleCategory(event) {
        this.setState({
            status: "LOADING",
            bookCategory: event.target.value
        },
            this.componentDidMount);
    }

    render() {
        let booksList = null;
        let loader = null;
        let sortedBooks = this.handleSortedBooks();
        let bookCategories;

        switch (this.state.status) {
            case "LOADING":
                loader = <div className="spinner"/>;
                break;
            case "LOADED":
                booksList = sortedBooks.map(book => (
                    <Link key={book.id} to={"/details/" + book.id}>
                        <div className="dishes-items">
                            <div className="dish">
                                <img className="dish-image" alt=""
                                     src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>
                                <div className="dish-text">
                                    <p className="book-text-title">{book.volumeInfo.title}</p>
                                    <p className="book-text-author">by 
                                        {book.volumeInfo.authors === undefined ? " Unknown" : book.volumeInfo.authors.map(author => 
                                                    {return (<span key={Math.floor((Math.random() * 10000000))}> {author}</span>);}
                                                ).reduce((prev, curr) => [prev, ', ', curr])}
                                    </p>
                                    <p className="book-text-info"> {book.volumeInfo.publishedDate}, {book.volumeInfo.language}, 
                                            ISBN {book.volumeInfo.industryIdentifiers[1] === undefined ? " Unknown" : book.volumeInfo.industryIdentifiers[1].identifier }
                                    </p>
                                    <p className="book-text-sale">{book.saleInfo.saleability}</p>   
                                </div>
                                <p className="book-rating">Average Rating: {book.volumeInfo.averageRating}</p>
                            </div>
                        </div>
                    </Link>
                ));
                break;
            default:
                booksList =
                    <div id="updateTitle">Please choose book category.</div>
                break;
        }

        return (
            bookCategories = (
                <div className="bookCategories">
                    <button type="submit" value='subject:Fiction' onClick={this.handleCategory}>Fiction</button>
                    <button type="submit" value='subject:Romance' onClick={this.handleCategory}>Romance</button>
                    <button type="submit" value='subject:History' onClick={this.handleCategory}>History</button>
                    <button type="submit" value='subject:Nonfiction' onClick={this.handleCategory}>Nonfiction</button>
                    <button type="submit" value='subject:Science' onClick={this.handleCategory}>Science</button>
                    <button type="submit" value='subject:Classic' onClick={this.handleCategory}>Classic</button>
                    <button type="submit" value='subject:Poems' onClick={this.handleCategory}>Poems</button>
                    <button type="submit" value='subject:Fantasy' onClick={this.handleCategory}>Fantasy</button>
                    <button type="submit" value='subject:Thriller' onClick={this.handleCategory}>Thriller</button>
                </div>
            ),

            <div className="Dishes">
                <div className="bookCatergoriesBar"> 
                    <label className="space">
                        <select id="selectTypeDish" value={this.state.type} onChange={this.handleSort} required>
                            <option disabled hidden value="">Sort by...</option>
                            <option>Most Popular</option>
                            <option>Publication date, old to new</option>
                            <option>Publication date, new to old</option>
                        </select>
                    </label>
                    {bookCategories}
                </div>
                <div className="outer-loader">{loader}</div>
                <div className="displayDishes">{booksList}</div>
            </div>
        );
    }
}

export default BookCategories;
