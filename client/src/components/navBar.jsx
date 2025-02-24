import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { getBookStoreByOwnerId } from '../services/bookstoreService';
import { getCurrentUser } from "../services/authService";

class NavBar extends Component {
  state = {
    storeId:""
  };
  async componentDidMount(){   
    const  user = getCurrentUser();
    console.log(user);
      if(user && user.TYPE=="Owner")
      {
        const {data:store} = await getBookStoreByOwnerId(user._id);
        console.log(store);
        if(store){
          this.setState({storeId:store._id});
        }
      }
  }
  render() {
    const { user } = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          BookMaker
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-item nav-link" to="/books">
              Books
            </NavLink>
            <NavLink className="nav-item nav-link" to="/users">
              Users
            </NavLink>
            {!user && (
              <React.Fragment>
                <NavLink className="nav-item nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-item nav-link" to="/register">
                  Register
                </NavLink>
              </React.Fragment>
            )}

            {user && user.TYPE != "Admin" && (
              <NavLink className="nav-item nav-link" to="/feeds">
                Feeds
              </NavLink>
            )}

            {user && user.TYPE != "Admin" && (
              <NavLink className="nav-item nav-link" to="/stores">
                All Bookstores
              </NavLink>
            )}

            {user && user.TYPE == "Reader" && (
              <React.Fragment>
                <NavLink className="nav-item nav-link" to="/cart">
                  Cart
                </NavLink>
                <NavLink className="nav-item nav-link" to="/orders">
                  Orders
                </NavLink>
                <NavLink className="nav-item nav-link" to="/rentals">
                  Rentals
                </NavLink>
                <NavLink className="nav-item nav-link" to="/mywishlist">
                  My Wish List
                </NavLink>
              </React.Fragment>
            )}

            {user && user.TYPE == "Critic" && (
              <NavLink className="nav-item nav-link" to="/mywishlist">
              My Wish List
            </NavLink>            
            )}

            {user && user.TYPE == "Admin" && (
              <NavLink className="nav-item nav-link" to="/admin">
                Published-Books
              </NavLink>
              
            )}
            {user && user.TYPE == "Admin" && (
              <NavLink className="nav-item nav-link" to="/createBookstore">
               Bookstores
              </NavLink>
            )}
            {user && user.TYPE == "Owner" && (
              <NavLink className="nav-item nav-link" to="/admin">
                Published-Books
              </NavLink>
            )}

            {user && user.TYPE == "Owner" && this.state.storeId!=""&& (
              <NavLink className="nav-item nav-link" to={`/store/${this.state.storeId}`}>
                My Store
              </NavLink>
            )}


            {user && (
              <React.Fragment>
                <NavLink
                  className="nav-item nav-link"
                  to={"/users/" + user._id}   
                >
                  {user.firstName}
                  <span className="badge badge-primary align-top"> {user.TYPE}</span>
                </NavLink>
                <NavLink className="nav-item nav-link" to="/logout">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
export default NavBar;
