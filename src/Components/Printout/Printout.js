import React, {Component} from "react";
import "./Printout.css";
import modelInstance from "../../data/BookligoModel";
import firebase, {auth} from "../../firebaseConfig/firebaseConfig";
import Link from "react-router-dom/Link";

class Printout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            booksFromDB: [],
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
                    bookDescription: books[book].bookDetails.volumeInfo.description,
                });
            }
            this.setState({
                booksFromDB: newState
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
        });
    }

    render() {
        let printBooks;
        let userDisplayName = this.state.user ? this.state.user.displayName : " ";

        printBooks = this.state.booksFromDB.map(book => (
            <>
                {book.user === userDisplayName ?
                    <div key={book.id} className="print-cluster">
                        <Link to={"/details/" + book.bookId}>
                            <img className="print-image" alt=""
                                src={(book.bookImageLinks === undefined) ?
                                    'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:'
                                    : `${book.bookImageThumbnail}`}/>
                        </Link>
                            <div className="dish-title">{book.title}</div>
                        <div>
                            <div>Description</div>
                            <br/>
                            <div id="dish-instructions" dangerouslySetInnerHTML={{__html: book.bookDescription}}/>
                        </div>
                    </div> : "" }
            </>
            ));

        return (
            <div id="print-container">{printBooks}</div>
        );
    }
}

export default Printout;

