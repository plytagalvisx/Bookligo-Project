import React, {Component} from "react";
import "./ShoppingCart.css";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";
import firebase, {auth, provider} from "../../firebaseConfig/firebaseConfig";

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        // we put on state the properties we want to use and modify in the component
        this.state = {
            status: "LOADING",
            numberOfBooks: modelInstance.getNumberOfBooks(),
            navBarOpen: false,
            //books: modelInstance.getFullShoppingCart(),
            //price: modelInstance.getTotalShoppingCartPrice(),
            toggled: false,

            booksFromDB: [],  // --> Books from Firebase DB
            user: modelInstance.getCurrentUser()
        };
        //this.removeBookFromShoppingCartButton = this.removeBookFromShoppingCartButton.bind(this);
        this.handleNavbar = this.handleNavbar.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.toggledShoppingCart = this.toggledShoppingCart.bind(this);
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

        let booksRef = firebase.database().ref('books');
        booksRef.on('value', (snap) => {
            let books = snap.val();
            let newState = [];
            for (let book in books) {
                newState.push({
                    id: book,
                    bookId: books[book].bookDetails.id,
                    title: books[book].bookDetails.volumeInfo.title,
                    user: books[book].user,
                    bookSaleAbility: books[book].bookDetails.saleInfo.saleability,
                    bookSaleInfo: books[book].bookDetails.saleInfo,
                    bookImageLinks: books[book].bookDetails.volumeInfo.imageLinks,
                    bookImageThumbnail: books[book].bookDetails.volumeInfo.imageLinks.thumbnail,
                });
            }
            this.setState({
                booksFromDB: newState
        });
            modelInstance.setBooksFromDB(this.state.booksFromDB);

        });
    }

    removeItem(bookId) {
        const bookRef = firebase.database().ref(`/books/${bookId}`);
        bookRef.remove();
    }

    toggledShoppingCart() {
        let toggle = !this.state.toggled;
        this.setState({
            toggled: toggle
        });
        console.log(this.state.toggled);
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
            numberOfBooks: modelInstance.getNumberOfBooks(),
            //books: modelInstance.getFullShoppingCart(),
            //price: modelInstance.getTotalShoppingCartPrice(),
        });
    }

    onCurrentUserChanged = e => {
        modelInstance.setCurrentUser(e.target.value);
    };

    // our handler for the input's on change event
    onNumberOfBooksChanged = e => {
        modelInstance.setNumberOfBooks(e.target.value);
    };

    /*removeBookFromShoppingCartButton(bookId) {
        modelInstance.removeBookFromShoppingCart(bookId);
        console.log("The book has been removed from shopping cart");
    }*/

    handleNavbar = () => {
        this.setState({navBarOpen: !this.state.navBarOpen});
    };

    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: "",
                    status: "LOADING",
                }, this.componentDidMount);
            });
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({
                    user,
                    status: "LOADING",
            }, this.componentDidMount);
            });
    }

    render() {
        let books = this.state.numberOfBooks;
        let price = this.state.price;
        let booksContainer;

        booksContainer = this.state.booksFromDB.map((book) => {
            return (
                <div key={book.id}>
                    {book.user === this.state.user.displayName ?
                        <div className="flex-between-dishes">
                            <div>{book.title}</div>
                            <div>{(book.bookSaleAbility === "FOR_SALE") ? Math.round(book.bookSaleInfo.retailPrice.amount) + ' SEK' : 'NOT FOR SALE'}</div>
                            <div>{books}</div>
                            <div>{(book.bookSaleAbility === "FOR_SALE") ? Math.round(book.bookSaleInfo.retailPrice.amount * books) + ' SEK' : 'NOT FOR SALE'}</div>
                            <p onClick={() => this.removeItem(book.id)}>&#x1f5d1;</p>
                        </div>
                        : ""}
                </div>
            )
        });

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
                        <div id="sidebar-dishes">
                            <div id="sidebar-signs">
                                <div id="shopping-cart-product">Product:</div>
                                <div id="shopping-cart-price">Price:</div>
                                <div id="shopping-cart-quantity">Quantity:</div>
                                <div id="shopping-cart-totalprice">Total Price:</div>
                                <input id="sidebar-num-people" type="number" min="1" value={this.state.numberOfBooks}
                                    onChange={this.onNumberOfBooksChanged}/>
                            </div>
                            {booksContainer}
                            <div id="sidebar-cost">
                                {/*<div>Total: {Math.round(price)} SEK</div>*/}
                            </div>
                        </div>
                        
                    </div>
                );
                break;
            default:
                collapsible = <b>Failed to collapse the sidebar, please try again</b>;
                break;
        }

        return (
            <div className="shopping-cart-dropdown">
                <div className='app'>
                    <header>
                        <div className="wrapper">
                           {/* {this.state.user ?
                                <button onClick={this.logout}>Logout</button>
                                :
                                <button value={this.state.user} onChange={this.onCurrentUserChanged}
                                        onClick={this.login}>Log In</button>
                            }*/}
                        </div>
                    </header>

                    {this.state.user ?
                        ""
/*
                        <div>
                            <div className='user-profile'>
                                <img className="dish-image-shoppingCart"  alt="" src={this.state.user.photoURL}/>
                                <p>User: {this.state.user.displayName}</p>
                            </div>
                        </div>
*/
                        :
                        <div className='wrapper'>
                            <p>You must be logged in to see the cart and submit to it.</p>
                        </div>
                    }
                </div>

                <div className="Sidebar">
                    {collapsible}
                </div>
            </div>
        );
    }
}

export default ShoppingCart;
