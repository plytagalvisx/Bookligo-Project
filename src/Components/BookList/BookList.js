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
        let dishesContainer;

        dishesContainer = this.state.books.map(book => (
            <div key={book.id} className="flex-between-dishes">
                <img className="dish-image-bookList" alt=""
                     src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>
                <div>
                    <div style={{color: "black"}}>Book Title:</div>
                    <div>{book.volumeInfo.title}</div>
                </div>
                <Link to="/bookList">
                    <button id="removeDishBtn" className="removeDishBtn"
                            onClick={() => this.removeBookFromListButton(book.id)}>
                        <p className="removeBtn">&#x1f5d1;</p>
                    </button>
                </Link>
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
                    <div className="collapsible">
                        <div id="flex-between">
                        </div>
                        <div id="sidebar-dishes">{dishesContainer}</div>
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
                    <div>My To-Read List</div>
                    <button id="collapse-sidebar-btn" className="hamburger" onClick={this.handleNavbar}></button>
                </div>
                {collapsible}
            </div>
        );
    }
}

export default BookList;
