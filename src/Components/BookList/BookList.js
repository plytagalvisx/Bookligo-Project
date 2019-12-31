import React, {Component} from "react";
import "./BookList.css";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";
import firebase, {auth} from "../../firebaseConfig/firebaseConfig";

class BookList extends Component {
    constructor(props) {
        super(props);

        // we put on state the properties we want to use and modify in the component
        this.state = {
            //books: modelInstance.getFullList(),
            navBarOpen: false,
            user: modelInstance.getCurrentUser(),

            bookListFromDB: [],

        };
        //this.removeBookFromListButton = this.removeBookFromListButton.bind(this);
        this.handleNavbar = this.handleNavbar.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    async componentDidMount() {
        modelInstance.addObserver(this);

        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user, status: "LOADED",});
            }
        });

        let bookListRef = await firebase.database().ref("bookList");
        bookListRef.once('value', (snap) => {
            console.log("book in the list: ", snap.val());
            let booksInList = snap.val();
            let newState = [];
            for (let bookInList in booksInList) {
                newState.push({
                    id: bookInList,
                    bookId: booksInList[bookInList].bookDetails.id,
                    title: booksInList[bookInList].bookDetails.volumeInfo.title,
                    user: booksInList[bookInList].user,
                    bookSaleAbility: booksInList[bookInList].bookDetails.saleInfo.saleability,
                    bookSaleInfo: booksInList[bookInList].bookDetails.saleInfo,
                    bookImageThumbnail: booksInList[bookInList].bookDetails.volumeInfo.imageLinks.thumbnail,
                    bookImageLinks: booksInList[bookInList].bookDetails.volumeInfo.imageLinks,
                    bookPublishedDate: booksInList[bookInList].bookDetails.volumeInfo.publishedDate,
                    bookAverageRating: booksInList[bookInList].bookDetails.volumeInfo.averageRating,
                    bookAuthors: booksInList[bookInList].bookDetails.volumeInfo.authors,
                });
            }
            this.setState({
                bookListFromDB: newState
            });
        });
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
            //books: modelInstance.getFullList(),
        });
    }

    /*removeBookFromListButton(bookId) {
        modelInstance.removeBookFromList(bookId);
    }*/

    removeItem(bookId) {
        const bookListRef = firebase.database().ref(`/bookList/${bookId}`);
        bookListRef.remove();

        this.componentDidMount();
    }

    handleNavbar = () => {
        this.setState({navBarOpen: !this.state.navBarOpen});
    };

    render() {
        let booksContainer;

       /* if(this.state.bookListFromDB.length === 0) {
            booksContainer = <div id="booklist-empty">
                <p> List is empty... </p>
                <p> Add some books to read! </p>
            </div>
        } else {*/
            booksContainer = this.state.bookListFromDB.map(book => (
                <div key={book.id}>
                    {book.user === this.state.user.displayName ?
                        <div className="flex-between-books">
                            <img className="dish-image-bookList" alt=""
                                 src={(book.bookImageLinks === undefined) ? 'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:' : `${book.bookImageThumbnail}`}/>
                            <div className="book-info-wrapper">
                                <div>
                                    <p className="book-title-sign">Book Title:</p>
                                    <p>{book.title}</p>
                                </div>
                                <div>
                                    <p className="book-author-sign">Author(s):</p>
                                    <div>{book.bookAuthors.map(author =>
                                            {return (<p key={Math.floor((Math.random() * 10000000))}>{author}</p>);}
                                            )}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="book-rating-sign">Average Rating:</p>
                                        <p>{book.bookAverageRating === undefined ? "0 / 5" : `${book.bookAverageRating} / 5`}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="book-date-sign">Published Date:</p>
                                    <p>{book.bookPublishedDate}</p>
                                </div>
                            </div>
                            <Link to="/bookList">
                                <p id="removeDishBtn" className="removeDishBtn"
                                   onClick={() => this.removeItem(book.id)}>
                                    <p className="removeBtn">&#x1f5d1;</p>
                                </p>
                            </Link>
                        </div> : ""}
                </div>
            ));

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
                    <div id="sidebar-dishes">{booksContainer}</div>
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
