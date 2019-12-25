import React, {Component} from "react";
import "./ShoppingCart.css";
import {Link} from "react-router-dom";

class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        // we put on state the properties we want to use and modify in the component
        this.state = {
            numberOfBooks: this.props.model.getNumberOfBooks(),
            books: this.props.model.getFullShoppingCart(),
            price: this.props.model.getTotalShoppingCartPrice(),
            navBarOpen: false
        };
        this.removeBookFromShoppingCartButton = this.removeBookFromShoppingCartButton.bind(this);
        this.handleNavbar = this.handleNavbar.bind(this);
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    componentDidMount() {
        this.props.model.addObserver(this);
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
            books: this.props.model.getFullShoppingCart(),
            price: this.props.model.getTotalShoppingCartPrice(),
        });
    }

    // our handler for the input's on change event
    onNumberOfBooksChanged = e => {
        this.props.model.setNumberOfBooks(e.target.value);
    };

    removeBookFromShoppingCartButton(bookId) {
        this.props.model.removeBookFromShoppingCart(bookId);
        console.log("The book has been removed from shopping cart");
    }

    handleNavbar = () => {
        this.setState({navBarOpen: !this.state.navBarOpen});
    };

    render() {
        let books = this.state.numberOfBooks;
        let price = this.state.price;
        let dishesContainer;

        dishesContainer = this.state.books.map(book => (
            <div key={book.id} className="flex-between-books">
                <img className="dish-image-bookList" alt=""
                     src={(book.volumeInfo.imageLinks === undefined) ? "" : `${book.volumeInfo.imageLinks.thumbnail}`}/>
                <div>
                    <div style={{color: "black"}}>Book Title:</div>
                    <div>{book.volumeInfo.title}</div>
                </div>
                <div>{(book.saleInfo.saleability === "FOR_SALE") ? Math.round(book.saleInfo.retailPrice.amount * books) + ' SEK' : 'NOT FOR SALE'}</div>
                <Link to="/shoppingCart">
                    <button id="removeDishBtn" className="removeDishBtn"
                            onClick={() => this.removeBookFromShoppingCartButton(book.id)}>
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
                        <div id="sidebar-people">Amount:</div>
                        <input id="sidebar-num-people" type="number" value={this.state.numberOfBooks}
                               onChange={this.onNumberOfBooksChanged}/>
                        <div id="flex-between">
                        </div>
                        <div id="sidebar-dishes">{dishesContainer}</div>
                        <div id="sidebar-cost">
                            <div>SEK {Math.round(price)}</div>
                        </div>
                    </div>
                );
                break;
            default:
                collapsible = <b>Failed to collapse the sidebar, please try again</b>;
                break;
        }

        return (
            <div className="Sidebar">
                <div id="sidebar-top">
                    <div>Shopping Cart</div>
                    <div className="SEK-text">SEK {price}</div>
                    <button id="collapse-sidebar-btn" className="hamburger" onClick={this.handleNavbar}></button>
                </div>

                {collapsible}
            </div>
        );
    }
}

export default ShoppingCart;
