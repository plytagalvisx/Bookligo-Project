import React, {Component} from "react";
import "./BookList.css";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";

class BookList extends Component {
    constructor(props) {
        super(props);

        // we put on state the properties we want to use and modify in the component
        this.state = {
            books: modelInstance.getFullList(),
            navBarOpen: false
        };
        this.removeBookFromListButton = this.removeBookFromListButton.bind(this);
        this.handleNavbar = this.handleNavbar.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    componentDidMount() {
        modelInstance.addObserver(this);
    }

    // this is called when component is removed from the DOM
    // good place to remove observer
    componentWillUnmount() {
        modelInstance.removeObserver(this);
    }

    // in our update function we modify the state which will
    // cause the component to re-render
    update() {
        this.setState({
            books: modelInstance.getFullList(),
        });
    }

    removeBookFromListButton(bookId) {
        modelInstance.removeBookFromList(bookId);
        console.log("The book has been removed from list");
    }

    handleNavbar = () => {
        this.setState({navBarOpen: !this.state.navBarOpen});
    };

    render() {
        let booksContainer;
        
        if(this.state.books.length === 0) {
            booksContainer = <div id="booklist-empty"> 
                <p> List is empty... </p>
                <p> Add some books to read! </p>
            </div>
        } else {
            booksContainer = this.state.books.map(book => (
                <div key={book.id} className="flex-between-books">
                    <img className="dish-image-bookList" alt=""
                         src={(book.volumeInfo.imageLinks === undefined) ? 'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:' : `${book.volumeInfo.imageLinks.thumbnail}`}/>
                    <div className="book-info-wrapper"> 
                        <div>
                            <p className="book-title-sign">Book Title:</p>
                            <p>{book.volumeInfo.title}</p>
                        </div>
                        <div>
                            <p className="book-author-sign">Author(s):</p>
                            <div>{book.volumeInfo.authors.map(author => 
                                    {return (<p key={Math.floor((Math.random() * 10000000))}>{author}</p>);}
                                    )}
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className="book-rating-sign">Average Rating:</p>
                                <p>{book.volumeInfo.averageRating === undefined ? "0 / 5" : `${book.volumeInfo.averageRating} / 5`}</p>
                            </div>
                        </div>
                        <div>
                            <p className="book-date-sign">Published Date:</p>
                            <p>{book.volumeInfo.publishedDate}</p>
                        </div>
                    </div>
                    <Link to="/bookList">
                        <button id="removeDishBtn" className="removeDishBtn"
                                onClick={() => this.removeBookFromListButton(book.id)}>
                            <p className="removeBtn">&#x1f5d1;</p>
                        </button>
                    </Link>
                </div>
            ));
        }
        

        let collapsible = null;
        let {navBarOpen} = this.state;

        switch (navBarOpen) {
            case true:
                collapsible = (
                    // Returns empty content for the sidebar navigation bar
                    <div></div>
                );
                break;
            case false:
                collapsible = (
                    <div className="collapsible">
                        <div id="flex-between">
                        </div>
                        <div id="sidebar-dishes">{booksContainer}</div>
                    </div>
                );
                break;
            default:
                collapsible = <b>Failed to collapse the book list bar, please try again</b>;
                break;
        }

        return (
            <div className="Sidebar">
                <div id="sidebar-top"> 
                    <button id="collapse-sidebar-btn" className="hamburger" onClick={this.handleNavbar}></button>
                </div>
                {collapsible}
            </div>
        );
    }
}

export default BookList;
