import React, { Component } from "react";
import { getAllOwners } from "../../services/userService";
import {
  createBookstore,
  getAllBookstores,
  deleteBookstore
} from "../../services/bookstoreService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ReactLoading from 'react-loading';
class BookStoreForm extends Component {
  state = {
    data: {
      ownerID: ""
    },
    owners: [],
    stores: [],
    storesloaded:false
  };

  async componentDidMount() {
    console.log("mounting allbookform");
    const { data: owners } = await getAllOwners();

    const { data: stores } = await getAllBookstores();
    this.setState({ owners, stores,storesloaded:true });
  }

  render() {
    return (
      <div>
        <div className="row">
          <h1>Create Bookstore</h1>
        </div>

        <form onSubmit={this.handleSubmit}>
          {this.renderSelectOwner("ownerID", "Select Owner")}
          {this.renderButtonField("Create")}
        </form>
        <hr />
        <div className="row">
          <h1>Existing Bookstores</h1>
        </div>
        <div className="row">
            {this.getStores()}
        </div>
      </div>
    );
  }

  getStores=()=>{
      if(!this.state.storesloaded){
        return <div className="col">
        <ReactLoading type={"bars"} color={"black"}/>
        </div>
      }
      
          return (<table className="table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Owner Name</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.stores.map(store => (
              <tr key={store._id}>
                <td>
                  <Link to={`/store/${store._id}`}>
                    {this.getFullName(store.owner) +
                      "-" +
                      store.owner.addresses[0].zip}
                  </Link>
                </td>
                <td>{this.getFullName(store.owner)}</td>
                <td>
                  <button
                    onClick={() => this.handleStoreDelete(store)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>);
  }

  handleStoreDelete = async store => {
    try {
      await deleteBookstore(store._id);
      window.location = "/createBookstore";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    const ownerID = this.state.data.ownerID;
    const storeObj = {
      owner: ownerID,
      inventory: []
    };
    try {
      await createBookstore(storeObj);
      window.location = "/createBookstore";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  renderSelectOwner(inputName, inputLabel) {
    const data = this.state.data;
    const choices = this.state.owners;
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor={inputName}>
            <h4>{inputLabel}</h4>
          </label>
          <select
            name={inputName}
            id={inputName}
            value={data["storeID"]}
            onChange={this.handleOwnerChange}
            className="form-control"
          >
            <option value="" />
            {choices.map(choice => (
              <option
                key={choice.firstName + choice.lastName}
                value={choice._id}
              >
                {this.getFullName(choice)}
              </option>
            ))}
          </select>
        </div>
      </React.Fragment>
    );
  }

  renderButtonField(buttonLabel) {
    return (
      <button type="submit" className="btn btn-primary m-2">
        {buttonLabel}
      </button>
    );
  }

  handleOwnerChange = e => {
    const input = e.currentTarget;
    const data = { ...this.state.data };
    data["ownerID"] = input.value;
    this.setState({ data });
  };

  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };
}

export default BookStoreForm;
