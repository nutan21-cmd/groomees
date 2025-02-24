import React, { Component } from "react";
import { getAllBookstores } from "../services/bookstoreService";

//Controlled Component  so remove this.state
class SingleOrder extends Component {

  render() {
    console.log("Counter - Rendering...");
    return (
        <div className="row">
        <div className="col-4">
        <span className="m-2">{this.getPrice()}</span>
          <span className={this.assignNumberClass()}>{this.getQuantity()}</span>
          <span>{this.props.order.bookID.title}</span>
          <span>{this.props.order.storeID._id}</span>
        </div>
        {!this.props.readOnly&&
        (<div className="col">
          <button
            onClick={() => this.props.onIncreaseQuanity(this.props.order)}
            className="btn btn-secondary btn-sm"
          >
            +
          </button>
          <button
            onClick={() => this.props.onDecreaseQuantity(this.props.order)}
            className="btn btn-secondary btn-sm m-2"
            disabled={this.props.order.quantity === 0 ? "disabled" : ""}
          >
            -
          </button>
          <button
            onClick={() => this.props.onDelete(this.props.order._id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        </div>)}
      </div>
    );
  }


  getQuantity = () => {
    if (this.props.order.quantity === 0) {
      return <h2>Zero</h2>;
    }
    return this.props.order.quantity ;
  };

  assignNumberClass() {
    let classes = "badge m-1 badge-";
   if(this.props.order.quantity == 0 )
   classes +="warning" 
   else classes+= "primary";
    return classes;
  }

  getPrice(){
      const order=this.props.order;
      const bookID=order.bookID._id;
//console.log(bookID);
//console.log(order);

const inven=order.storeID.inventory.filter(i=>i.bookID==bookID)[0];
   return "$ "+inven.price; 
   
  }

}

export default SingleOrder;
