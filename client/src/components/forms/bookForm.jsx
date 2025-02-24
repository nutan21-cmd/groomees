import React, { Component } from "react";
import { getAllGenres } from "../../services/genreService";
import { getbooksFromAllBookstores } from "../../services/bookService";
import {
  getAllBookstores,
  getBookStoreById,
  addInventoryToBookstore,
  deleteBookFromBookstore
} from "../../services/bookstoreService";
import {
  getAllOrdersOfCustomer,
  updateOrder,
  postNewOrder
} from "../../services/orderService";
import {
  addNewOrderToCart,
  getCustomerCart,
  addToCart,
  rentToCart
} from "../../services/cartService";
import { postEmptyCart } from "../../services/cartService";
import {
  getBookshelfByPersonId,
  updateBookShelf,
  getAllreviewsforBook
} from "../../services/bookshelService";
import { postFeedToAllFollowers } from "../../services/userService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class BookForm extends Component {
  state = {
    data: {
      title: "",
      genre: "",
      author: "",
      rating: 0,
      storeID: "",
      quantity: 0,
      price: 0
    },
    genres: [],
    stores: [],
    reviews: [],
    criticReviews: [],
    userRating: 0,
    userStatus: "",
    userReview: "",
    status: [],
    canIRate: false,
    isAdmin: false,
    isOwnerOfThisStore: false
    //todo dropdown for store address only for admin
  };

  async populateAllGenres() {
    const { data: genres } = await getAllGenres();
    this.setState({ genres });
  }

  async populateAllStores() {
    const { data: stores } = await getAllBookstores();
    this.setState({ stores });
  }

  async populateBook() {
    const bookId = this.props.match.params.id;
    const storeID = this.props.match.params.storeID;
    if (bookId === "new") return;

    const { data: books } = await getbooksFromAllBookstores();
    const book = books.filter(b => b._id == bookId && b.storeID == storeID)[0];
    this.setState({ data: this.mapToViewModel(book) });
  }
  async populateRatings() {
    const { data: shelf } = await getBookshelfByPersonId(this.props.user._id); //get this users bookshelf
    console.log(shelf);
    if (shelf.details.length != 0) {
      //if user has any book
      const available =
        shelf.details.filter(d => d.bookID == this.state.data._id).length != 0; //user has this book
      if (available) {
        const detail = shelf.details.filter(
          d => d.bookID == this.state.data._id
        )[0]; //get the book
        this.setState({
          canIRate: true,
          userRating: detail.rating,
          userReview: detail.review,
          userStatus: detail.status
        });
      }
    }
  }

  async populateOthersRatings() {
    const { data: shelf } = await getAllreviewsforBook(this.state.data._id); //get this users bookshelf
    const reviews = shelf.filter(s => s.personID.TYPE != "Critic");
    const criticReviews = shelf.filter(s => s.personID.TYPE == "Critic");
    this.setState({ reviews, criticReviews });
  }

  async componentDidMount() {
    await this.populateAllGenres();
    await this.populateBook();
    await this.populateAllStores();
    await this.populateRatings();
    await this.populateOthersRatings();

    const status = ["WANTS TO READ", "BOUGHT", "RENTED", "READING", "READ"];
    const canIRate =
      this.props.user != null &&
      (this.props.user.TYPE == "Reader" ||
      this.props.user.TYPE == "Critic");

    const isAdmin = this.props.user != null && this.props.user.TYPE == "Admin";

    const { data: store } = await getBookStoreById(this.state.data.storeID);
    console.log(store);
    console.log(this.props.user._id);
    const isOwnerOfThisStore = store.owner == this.props.user._id;

    this.setState({ status, canIRate, isAdmin, isOwnerOfThisStore });
  }

  mapToViewModel(book) {
    console.log(book);
    return {
      _id: book._id,
      storeID: book.storeID,
      title: book.title,
      genre: book.genre,
      author: this.getFullName(book.author),
      rating: book.rating.averageRating,
      storeAddress: this.getStoreAddress(book.storeAddress),
      quantity: book.quantity,
      publisher:book.publisher,
      publishedYear:book.publishedYear,
      pages:book.pageCount,
      thumbnail:book.Links.thumbnail,
      language:book.language,
      price: book.price,
      ratingsCount: book.rating.ratingsCount,
      description: book.description
    };
  }

  getStoreAddress = st => {
    return st.street + " " + st.city + " " + st.state + " " + st.zip;
  };

  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };

  renderButtonField(buttonLabel) {
    if (this.state.isAdmin || this.state.isOwnerOfThisStore)
      return <button className="btn btn-primary m-2">{buttonLabel}</button>;
  }
  renderBuyButton() {
    return (
      <button
        onClick={() => {
          this.handleAddToCart();
        }}
        className="btn btn-success m-2"
      >
        Add to Cart
      </button>
    );
  }

  renderRentButton() {
    return (
      <button
        onClick={() => {
          this.handleRentToCart();
        }}
        className="btn btn-info m-2"
      >
        Rent
      </button>
    );
  }

  async handleAddToCart() {
    const userId = this.props.user._id;
    const storeId = this.state.data.storeID;
    const bookId = this.state.data._id;
    await addToCart(bookId, storeId, userId);
    toast.success("Order Added to Cart!");
  }

  async handleRentToCart() {
    const userId = this.props.user._id;
    const storeId = this.state.data.storeID;
    const bookId = this.state.data._id;
    await rentToCart(bookId, storeId, userId);
    toast.success("Rental Added to Cart!");
  }

  renderDeleteButton() {
      return (
        <button
          className="btn btn-primary btn-danger m-2"
          onClick={() => this.handleBookDelete()}
        >
          Delete Book from this Store
        </button>
      );
  }

  async handleBookDelete() {
    console.log(this.state.data);
    await deleteBookFromBookstore(this.state.data.storeID, this.state.data._id);

    this.props.history.push("/books");
  }
  renderImage=()=>{
  
    //console.log(this.state.data.Links);
    return <img src={this.state.data.thumbnail}></img>
  }

  render() {
    const { canIRate, isAdmin, isOwnerOfThisStore } = this.state;
    const isReader=this.props.user.TYPE=="Reader";
    return (
      <React.Fragment>
        <div>
          <div className="row">
          <div className="col-3"> {this.renderImage()}</div>
            <div className="col-3"> { isReader&& this.renderBuyButton()}</div>
            <div className="col-3"> { isReader && this.renderRentButton()}</div>
            <div className="col-3"> {(isOwnerOfThisStore || isAdmin) && this.renderDeleteButton()}</div>
          </div>
          <h1>{this.state.data.title}</h1>
          <form onSubmit={this.handleSubmit}>
           
            <h5>Published Year : {this.state.data.publishedYear}</h5>
            <h5>Publisher : {this.state.data.publisher}</h5>
            <h5>Pages : {this.state.data.pages}</h5>

            {this.renderInputField("language", "Language", "text", true)}
            {this.rendeDescription("description", "Description", "text", true)}
            {this.renderInputField("author", "Author", "text", true)}
            {this.renderInputField("rating", "Overall Rating", "number", true)}
            {this.renderInputField(
              "ratingsCount",
              "Ratings Count",
              "number",
              true
            )}

            {this.renderSelectGenre("genre", "Genre")}
            {this.renderAddressField("storeAddress", "Store Address")}
            {this.renderInputField(
              "quantity",
              "Quantity Available in store",
              "number",
              !(isAdmin || isOwnerOfThisStore)
            )}
            {this.renderPrice(
              "price",
              "Store Price",
              "number",
              !(isAdmin || isOwnerOfThisStore)
            )}
            {canIRate &&
              this.renderRatingsFields("userRating", "Your Rating", "number")}
            {canIRate && this.rendeReview("userReview", "Your Review", "text")}
            {canIRate && this.renderSelectStatus("userStatus", "Status")}
            {/* Only admin and owner of this store can update this book's quantity and price */}
            {this.renderButtonField("Update Book Store")}
            {/* you can only rate the book if you are reader or critic */}
            {canIRate && (
              <button
                onClick={() => {
                  this.handleSaveRatings();
                }}
                className="btn btn-primary m-2"
              >
                Save to my Bookshelf
              </button>
            )}
          </form>
        </div>
        <hr/>
        <div className="row">
          <h3>User Reviews</h3>
        </div>
        <div className="row">
          {this.getUserReviews()}
        </div>{" "}
        <hr/>

        <div className="row">
          <h3>Critic Reviews</h3>
        </div>
        <div className="row">
          {this.getCriticsReviews()}
        </div>{" "}
      </React.Fragment>
    );
  }
getCriticsReviews=()=>{
  if(this.state.criticReviews.length==0)
      return <p>No Critics Reviews Yet!</p>

      return (<table className="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Rating</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody>
        {this.state.criticReviews.map(review => (
          <tr key={review.bookID + review.personID}>
            <td>
              <Link to={`/users/${review.personID._id}`}>
                {this.getFullName(review.personID)}
              </Link>
            </td>
            <td> {review.rating}</td>
            <td>{review.review}</td>
          </tr>
        ))}
      </tbody>
    </table>)
}

  getUserReviews=()=>{
    if(this.state.reviews.length==0)
      return <p>No User Reviews Yet!</p>
    
      return(<table className="table">
      <thead>
        <tr>
          <th>User</th>
          <th>Rating</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody>
        {this.state.reviews.map(review => (
          <tr key={review.bookID + review.personID}>
            <td>
              <Link to={`/users/${review.personID._id}`}>
                {this.getFullName(review.personID)}
              </Link>
            </td>
            <td> {review.rating}</td>
            <td>{review.review}</td>
          </tr>
        ))}
      </tbody>
    </table>)
    
  }

  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };

  handleChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  };

  handleRatingChange = e => {
    const input = e.currentTarget;
    this.setState({ userRating: input.value });
  };

  handleReviewChange = e => {
    const input = e.currentTarget;
    this.setState({ userReview: input.value });
  };

  handleStatusChange = e => {
    const input = e.currentTarget;
    this.setState({ userStatus: input.value });
  };

  handleGenreChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data["genre"] = input.value;
    this.setState({ data });
  };

  handleStoreChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    const storeID = input.value;
    data["storeID"] = storeID;

    const store = this.state.stores.filter(s => s._id === storeID)[0];
    console.log(store);
    const addressObj = store.owner.addresses[0];
    data["storeAddress"] = this.getStoreAddress(addressObj);

    this.setState({ data });
  };

  renderInputField(inputName, inputLabel, inputType = "text", readonlyattr) {
    const data = this.state.data;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <input
            readonly={readonlyattr ? "readonly" : false}
            type={inputType}
            name={inputName}
            id={inputName}
            value={data[inputName]}
            label={inputLabel}
            onChange={this.handleChange}
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }

  renderPrice(inputName, inputLabel, inputType = "text", readonlyattr) {
    const data = this.state.data;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <input step="0.01"
            readonly={readonlyattr ? "readonly" : false}
            type={inputType}
            name={inputName}
            id={inputName}
            value={data[inputName]}
            label={inputLabel}
            onChange={this.handleChange}
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }

  renderRatingsFields(inputName, inputLabel, inputType = "text", readonlyattr) {
    const data = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <input
            readonly={readonlyattr ? "readonly" : false}
            type={inputType}
            name={inputName}
            id={inputName}
            value={data[inputName]}
            label={inputLabel}
            onChange={
              inputName == "userRating"
                ? this.handleRatingChange
                : this.handleReviewChange
            }
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }

  rendeReview(inputName, inputLabel, inputType = "text", readonlyattr) {
    const data = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <textarea
            rows="6"
            readonly={readonlyattr ? "readonly" : false}
            type={inputType}
            name={inputName}
            id={inputName}
            value={data[inputName]}
            label={inputLabel}
            onChange={
              inputName == "userRating"
                ? this.handleRatingChange
                : this.handleReviewChange
            }
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }

  rendeDescription(inputName, inputLabel, inputType = "text", readonlyattr) {
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <textarea
            rows="10"
            readonly={readonlyattr ? "readonly" : false}
            type={inputType}
            name={inputName}
            id={inputName}
            value={this.state.data[inputName]}
            label={inputLabel}
            onChange={
              inputName == "userRating"
                ? this.handleRatingChange
                : this.handleReviewChange
            }
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }

  renderAddressField(inputName, inputLabel, inputType = "text") {
    const data = this.state.data;
    return (
      <div className="form-group">
        <label htmlFor={inputName}>{inputLabel}</label>
        <input
          readonly="readonly"
          type={inputType}
          name={inputName}
          id={inputName}
          value={data[inputName]}
          label={inputLabel}
          className="form-control"
        />
      </div>
    );
  }

  handleSubmit = async e => {
    e.preventDefault();
    //store and author are readOnly
    //update book->title,rating,genre
    //update store-book->quantity, price
    console.log(this.state.data);
    let obj = {
      bookID: this.state.data._id,
      quantity: this.state.data.quantity,
      price: this.state.data.price
    };
    try{
      await addInventoryToBookstore(this.state.data.storeID, obj);
      const owner= this.state.stores.filter(s=>s._id==this.state.data.storeID)[0].owner;
      console.log(owner);

      let status= this.getFullName(owner)+" Updated Book "+"'"+this.state.data.title+"'"+" to the STORE:"+
    this.state.data.storeAddress;

    await postFeedToAllFollowers(owner._id,status);
    this.props.history.push("/books");
    }catch (ex) {
      if (ex.response) {
        toast.error(ex.response.data);
      }
    }
  
  };

  handleSaveRatings = async () => {
    console.log(this.state.userRating);
    console.log(this.state.userReview);
    console.log(this.state.userStatus);
    const updatedDetail = {
      bookID: this.state.data._id,
      status: this.state.userStatus,
      rating: this.state.userRating,
      review: this.state.userReview
    };
    let statusFeed =
      this.getFullName(this.props.user) +
      " " +
      this.state.userStatus +
      " " +
      this.state.data.title +
      "\n and Rated it " +
      this.state.userRating +
      "/10";

    statusFeed += "\n as well as Reviewed it: " + this.state.userReview;

    console.log(statusFeed);

    await postFeedToAllFollowers(this.props.user._id, statusFeed);

    await updateBookShelf(this.props.user._id, updatedDetail);
    this.props.history.push("/books");
  };

  renderSelectGenre(inputName, inputLabel) {
    const data = this.state.data;
    const choices = this.state.genres;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <select
            disabled
            name={inputName}
            id={inputName}
            value={data["genre"]}
            onChange={this.handleGenreChange}
            className="form-control"
          >
            <option value="" />
            {choices.map(choice => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </div>
      </React.Fragment>
    );
  }

  renderSelectStatus(inputName, inputLabel) {
    const data = this.state;
    const choices = this.state.status;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <select
            name={inputName}
            id={inputName}
            value={data["userStatus"]}
            onChange={this.handleStatusChange}
            className="form-control"
          >
            <option value="" />
            {choices.map(choice => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </div>
      </React.Fragment>
    );
  }

  renderSelectStore(inputName, inputLabel) {
    const data = this.state.data;
    const readonlyattr = true;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <input
            readonly={readonlyattr ? "readonly" : false}
            type="text"
            name={inputName}
            id={inputName}
            value={data[inputName]}
            label={inputLabel}
            onChange={this.handleChange}
            className="form-control"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default BookForm;
