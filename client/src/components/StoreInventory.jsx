import React, { Component } from "react";
import { getAllBookstores } from "../services/bookstoreService";
import { Link } from 'react-router-dom';
class StoreInventory extends Component {
  state = { 
      storeName:"",
      inventory: [] };

  async componentDidMount() {
    const {data:stores}=await getAllBookstores();
    const store=stores.filter(s=>s._id==this.props.match.params.id)[0];
    const storeName= this.getFullName(store.owner) +
    "-" +
    store.owner.addresses[0].zip
    this.setState({ inventory: store.inventory,storeName });
  }

  render() {
      const storeID=this.props.match.params.id;
      if(this.state.inventory.length==0)
      return <h2>No books available in this store</h2>

    return (
      <React.Fragment>
        <div className="row">
          <h1>Store Inventory</h1>
        </div>
        <p>{this.state.inventory.length} books found</p>
        <div className="row">
        <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Store Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {this.state.inventory.map(inventory => (
                <tr key={inventory._id}>
                  <td><Link to={`/books/${inventory.bookID._id}/${storeID}`}>{inventory.bookID.title}</Link></td>
                  <td>{inventory.bookID.genre}</td>
                  <td> {this.state.storeName}</td>
                  <td>{inventory.quantity}</td>
                  <td>{inventory.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{" "}
      </React.Fragment>
    );
  }
  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };
}

export default StoreInventory;
