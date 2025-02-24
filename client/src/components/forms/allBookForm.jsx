import React, { Component } from "react";
import { getAllGenres } from "../../services/genreService";

import {
  getAllBookstores,
  addInventoryToBookstore,
  getBookStoreById
} from "../../services/bookstoreService";
import { getBookById, getbooksFromAllBookstores } from "../../services/bookService";
import { postFeedToAllFollowers } from '../../services/userService';
import { toast } from 'react-toastify';

class AllBookForm extends Component {
  state = {
    data: {
      title: "",
      genre: "",
      author: "",
      storeID: "",
      rating: 0,
      owner:{}
    },
    genres: [],
    stores: []
    //todo dropdown for store address only for admin
  };

  handleSubmit = async e => {
    e.preventDefault();
    console.log("here");
    const storeID= this.state.data.storeID;
    const inventoryObj = {
      bookID: this.state.data._id,
      quantity: this.state.data.quantity,
      price: this.state.data.price
    };
    console.log(storeID);
    console.log(inventoryObj);
    try{
      await addInventoryToBookstore(storeID, inventoryObj);
      let status= this.getFullName(this.state.data.owner)+" Added Book "+"'"+this.state.data.title+"'"+" to the STORE:"+
    this.state.data.storeAddress;

    await postFeedToAllFollowers(this.state.data.owner._id,status);
    toast.info("Data Saved!")
    this.props.history.push("/admin/books");

    }catch (ex) {
      if (ex.response) {
        toast.error(ex.response.data);
      }
    }

    //const {data:store} = await getBookStoreById(this.state.data.storeID);
    


    //update book->title,rating,genre
    //update store-book->quantity, price
  };

  async submit() {
    console.log(this.state.data._id);
    console.log(this.state.quantity);
  }

  async populateAllGenres() {
    const { data: genres } = await getAllGenres();
    this.setState({ genres });
  }

  async populateAllStores() {
    let { data: stores } = await getAllBookstores();
    const {user}=this.props;
    if(user && user.TYPE=="Owner"){
      stores=stores.filter(s=>s.owner._id==user._id);
    }
    this.setState({ stores });
  }

  async populateBook() {
    const bookId = this.props.match.params.id;
    if (bookId === "new") return;
    const { data: book } = await getBookById(bookId);
    this.setState({ data: this.mapToViewModel(book) });
  }

  async componentDidMount() {
    console.log("mounting allbookform")
    await this.populateAllGenres();
    await this.populateBook();
    await this.populateAllStores();
  }

  mapToViewModel(book) {
    return {
      _id: book._id,
      title: book.title,
      genre: book.genre,
      description:book.description,
      thumbnail:book.Links.thumbnail,
      author: this.getFullName(book.author),
      rating: book.rating.averageRating
    };
  }

  renderImage=()=>{
  
    return <img src={this.state.data.thumbnail}></img>
  }

  getStoreAddress = st => {
    return st.street + " " + st.city + " " + st.state + " " + st.zip;
  };

  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };

  renderButtonField(buttonLabel) {
    return (
      <button type="submit" className="btn btn-primary m-2">
        {buttonLabel}
      </button>
    );
  }

  render() {
    console.log("rendering allbookform")

    const { match, history } = this.props;
    return (
      <div>
        <div className="row">
        <div className="col-3"> {this.renderImage()}</div>
        </div>
        <h1>{this.state.data.title}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInputField("title", "Title", "text", true)}
          {this.rendeDescription("description", "Description", "text",true)}


          {this.renderInputField("author", "Author", "text", true)}
          {this.renderInputField("rating", "Rating", "number",true)}

          {this.renderSelectGenre("genre", "Genre")}
          {this.renderSelectStore("storeId", "Store")}
          {this.renderAddressField("storeAddress", "Store Address")}
          {this.renderQuantity("quantity", "Quantity", "number")}
          {this.renderPrice("price", "Price", "number")}
          {this.renderButtonField("Save")}
        </form>
      </div>
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

  renderQuantity(inputName, inputLabel, inputType = "text", readonlyattr) {
    const data = this.state.data;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <input min="1" step="1"
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

  handleChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  };

  handleGenreChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data["genre"] = input.value;
    this.setState({ data });
  };

  handleStoreChange = async e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    const storeID = input.value;
    data["storeID"] = storeID;

    const store = this.state.stores.filter(s => s._id === storeID)[0];
    console.log(store);
    const addressObj = store.owner.addresses[0];
    data["storeAddress"] = this.getStoreAddress(addressObj);
    data["owner"]=store.owner;

    const { data: books } = await getbooksFromAllBookstores();
    const book = books.filter(b => b._id == data._id && b.storeID == storeID);

    data.quantity=0;
    data.price=0;

    if(book.length!=0){
        data.quantity=book[0].quantity;
        data.price=book[0].price;
    }
    
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

  renderSelectGenre(inputName, inputLabel) {
    const data = this.state.data;
    const choices = this.state.genres;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <select disabled
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

  renderSelectStore(inputName, inputLabel) {
    const data = this.state.data;
    const choices = this.state.stores;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>{inputLabel}</label>
          <select
            name={inputName}
            id={inputName}
            value={data["storeID"]}
            onChange={this.handleStoreChange}
            className="form-control"
          >
            <option value="" />
            {choices.map(choice => (
              <option key={choice.owner} value={choice._id}>
                {this.getFullName(choice.owner) +
                  "-" +
                  choice.owner.addresses[0].zip}
              </option>
            ))}
          </select>
        </div>
      </React.Fragment>
    );
  }
}

export default AllBookForm;
