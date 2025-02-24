import React, { Component } from "react";
import "./App.css";
import Books from "./components/books";
import NavBar from "./components/navBar";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Switch } from "react-router-dom";
import NothingFound from "./components/nothingFound";
import BookForm from "./components/forms/bookForm";

import { getUserById } from "./services/userService";
import Cart from "./components/cart";
import AllBooks from "./components/allBooks";
import AllBookForm from "./components/forms/allBookForm";
import Orders from "./components/orders";
import Users from "./components/users";
import UserForm from "./components/forms/userForm";
import Feeds from "./components/feeds";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import { getCurrentUser } from "./services/authService";
import Logout from "./components/logout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoggedInRoute from './components/common/loggedInRoute';
import AdminRoute from './components/common/adminRoute';
import Rentals from './components/rentals';
import MyWishList from './components/myWishList';
import BookStoreForm from './components/forms/bookstoreForm';
import StoreInventory from './components/StoreInventory';
import Stores from "./components/stores";


class App extends Component {
  state = {};
  async componentDidMount() {
    const user = getCurrentUser();
    this.setState({ user });
  }

  render() {
    console.log("app-rendering");
    return (
      <React.Fragment>
        <ToastContainer/>
        <NavBar user={this.state.user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />

            <LoggedInRoute path="/logout" component={Logout} />
            <LoggedInRoute
              path="/books/:id/:storeID"
              render={props => <BookForm {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/cart"
              render={props => <Cart {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/orders"
              render={props => <Orders {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/rentals"
              render={props => <Rentals {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/feeds"
              render={props => <Feeds {...props} user={this.state.user} />}
            />
            <Route
              path="/books"
              render={props => <Books {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/mywishlist"
              render={props => <MyWishList {...props} user={this.state.user} />}
            />

            <LoggedInRoute
              path="/users/:id"
              render={props => <UserForm {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/users"
              render={props => <Users {...props} user={this.state.user} />}
            />

            <AdminRoute
              path="/admin/books/:id"
              render={props => (
                <AllBookForm {...props} user={this.state.user} />
              )}
            />

            <AdminRoute
              path="/admin"
              render={props => <AllBooks {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/stores"
              render={props => <Stores {...props} user={this.state.user} />}
            />
            <AdminRoute
              path="/createBookstore"
              render={props => <BookStoreForm {...props} user={this.state.user} />}
            />
            <LoggedInRoute
              path="/store/:id"
              render={props => <StoreInventory {...props} user={this.state.user} />}
            />
           
            <Route path="/nothing-found" component={NothingFound} />
            <Redirect from="/" exact to="/books" />
            <Redirect to="/nothing-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
