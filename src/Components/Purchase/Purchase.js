import React, {Component} from "react";
import "./Purchase.css";
import modelInstance from "../../data/BookligoModel";
import firebase, { auth } from "../../firebaseConfig/firebaseConfig";
import Link from "react-router-dom/Link";

class Purchase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            booksFromDB: [],
            numberOfBooks: modelInstance.getNumberOfBooks(),

            pricesFromDB: [],
        };
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    async componentDidMount() {
        modelInstance.addObserver(this);

        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
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
                    bookImageLinks: books[book].bookDetails.volumeInfo.imageLinks,
                    bookImageThumbnail: books[book].bookDetails.volumeInfo.imageLinks.thumbnail,
                    bookSaleAbility: books[book].bookDetails.saleInfo.saleability,
                    bookSaleInfo: books[book].bookDetails.saleInfo,
                });
            }

            let prices = [];
            for (let book in books) {
                prices.push({
                    price: books[book].bookDetails.saleInfo,
                    bookId: books[book].bookDetails.id,
                    user: books[book].user,
                });
            }
            this.setState({
                booksFromDB: newState,
                pricesFromDB: prices
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
            numberOfBooks: modelInstance.getNumberOfBooks(),
        });
    }

    render() {
        console.log("User: ", this.state.user);
        let confirmedBooks;
        let userDisplayName = this.state.user ? this.state.user.displayName : " ";
        let books = this.state.numberOfBooks;
        /*let totalPrice = this.state.pricesFromDB.reduce((total, amount) =>
            (amount.user === userDisplayName ? Math.round(total + amount.price.retailPrice.amount) : 0), 0);*/

        confirmedBooks = this.state.booksFromDB.map(book => (
            <>
                {book.user === userDisplayName ?
                    <div key={book.id}>
                        <li className="book">
                            <img className="dish-image" alt="" src={(book.bookImageLinks === undefined) ? 'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:' : `${book.bookImageThumbnail}`}/>
                            <p className="dish-text">{book.title}</p>
                            <div>{(book.bookSaleAbility === "FOR_SALE") ? Math.round(book.bookSaleInfo.retailPrice.amount * books) + ' SEK' : 'NOT FOR SALE'}</div>
                        </li>
                    </div>
                    : ""}
            </>
        ));

        return (
            <div>
                {this.state.user ?
                    <div id="overviewmain" className="main">
                        <div id="books-container">
                            <ul id="overview-books-items">{confirmedBooks}</ul>
                            <div id="vertline"></div>
                            <div id="booksPrice-container">
                                <div>Total: </div>
                                {/*<div>{totalPrice} SEK</div>*/}
                            </div>
                        </div>
                        <div className="horiline"></div>
                        <Link to="/printout">
                            <button>Print full recipe</button>
                        </Link>
                    </div>
                    : "You must login to confirm purchases" }
            </div>
        );
    }
}

export default Purchase;
