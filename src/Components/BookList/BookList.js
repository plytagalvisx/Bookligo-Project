import React, {Component} from "react";
import "./BookList.css";
import {Link} from "react-router-dom";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    // we put on state the properties we want to use and modify in the component
    this.state = {
      numberOfGuests: this.props.model.getNumberOfGuests(),
      books: this.props.model.getFullMenu(),
      price: this.props.model.getTotalMenuPrice(),
      navBarOpen: false
    };
    this.removeDishFromMenuButton = this.removeDishFromMenuButton.bind(this);
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
      numberOfGuests: this.props.model.getNumberOfGuests(),
      books: this.props.model.getFullMenu(),
      price: this.props.model.getTotalMenuPrice(),
    });
  }

  // our handler for the input's on change event
  onNumberOfGuestsChanged = e => {
    this.props.model.setNumberOfGuests(e.target.value);
  };

  removeDishFromMenuButton(dishId) {
    this.props.model.removeDishFromMenu(dishId);
    console.log("The dish has been removed");
  }

  handleNavbar = () => {
    this.setState({ navBarOpen: !this.state.navBarOpen });
  }

  render() {
    let guests = this.state.numberOfGuests;
    let price = this.state.price;
    let dishesContainer;

    dishesContainer = this.state.books.map(book => (
        <div key={book.id} className="flex-between-dishes">
          <div>{book.volumeInfo.title}</div>
            <div>{(book.saleInfo.saleability === "FOR_SALE") ? Math.round(book.saleInfo.retailPrice.amount * guests) + ' SEK' : 'NOT FOR SALE' }</div>
          <Link to="/bookList">
            <button id="removeDishBtn" className="removeDishBtn" onClick={() => this.removeDishFromMenuButton(book.id)}>
              <p className="removeBtn">&#x1f5d1;</p>
            </button>
          </Link>
        </div>
    ));

    let collapsible = null;
    let { navBarOpen } = this.state;

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
              <div id="sidebar-people">People:</div>
              <input id="sidebar-num-people" type="number" value={this.state.numberOfGuests} onChange={this.onNumberOfGuestsChanged}/>
              <div id="flex-between">
                <div>Dish Name</div>
                <div>Cost</div>
              </div>
              <div id="sidebar-dishes">{dishesContainer}</div>
              <div id="sidebar-cost">
                <div>SEK {Math.round(price)}</div>
              </div>

              <div id="sidebar-confirm"></div>
              <Link to="/search">
                <button id="sidebarBtn" className="startBtn">Back to search</button>
              </Link>
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
            <div>My Dinner</div>
            <div className="SEK-text">SEK {price}</div>
            <button id="collapse-sidebar-btn" className="hamburger" onClick={this.handleNavbar}></button>
          </div>

          {collapsible}
        </div>
    );
  }
}

export default Sidebar;
