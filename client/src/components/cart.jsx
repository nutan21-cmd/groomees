import React, { Component } from "react";
import {
  getCustomerCart,
  deleteOrderFromCart,
  checkout,
  deleteRentalFromCart
} from "../services/cartService";
import SingleOrder from "./singleOrder";
import {
  getAllOrderDetailed,
  getAllRentalDetailed
} from "../services/orderService";
import { getCurrentUser } from "../services/authService";
import { toast } from 'react-toastify';

class Cart extends Component {
  state = {
    cart:{},
    orders: [],
    rentals: []
  };

  async componentDidMount() {

    let user =this.props.user;
    if(!user){
      user=getCurrentUser();
    }

    const {data:cart}=await getCustomerCart(user._id);

    const { data: orders } = await getAllOrderDetailed(user._id);
    const userOrders = orders.filter(
      order => order.customerID == user._id &&order.status=="ADDED TO CART"
    );
    const { data: rentals } = await getAllRentalDetailed(user._id);
    const userRentals = rentals.filter(
      order => order.customerID == user._id && order.status=="ADDED TO CART"
    );
    this.setState({cart,orders: userOrders, rentals: userRentals });
  }

  handleIncreaseQuanity = order => {
    //api call to increase q
  };

  handleDecreaseQuantity = counter => {};

  async handleOrderCheckout() {
    const { data } = await getCustomerCart(this.props.user._id);
    const cartID = data._id;
    await checkout(cartID);
    window.location="/cart";
    alert("Order placed successfully,Order id is: "+cartID);
  }

  render() {
    const { orders, rentals } = this.state;
    if (orders.length == 0&&rentals.length==0) {
      return <h2>Cart is empty!</h2>;
    }
    return (
      <div>
        <h3>Orders</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Store Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              return (
                <tr key={order._id}>
                  <td>{order.bookID.title}</td>
                  <td>{order.quantity}</td>
                  <td>{"$" + order.price}</td>
                  <td>
                    {this.getStoreAddress(order.storeID.owner.addresses[0])}
                  </td>
                  <td><button onClick={()=>{this.removeOrder(order._id)}} className="btn btn-danger">Remove from Cart</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Rentals</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Daily Rental Rate</th>
              <th>Duration</th>
              <th>Store Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(order => {
              return (
                <tr key={order._id}>
                  <td>{order.bookID.title}</td>
                  <td>{order.quantity}</td>
                  <td>{"$" + order.dailyRentalRate}</td>
                  <td>30 Days</td>
                  <td>
                    {this.getStoreAddress(order.storeID.owner.addresses[0])}
                  </td>
                  <td><button  onClick={()=>{this.removeRental(order._id)}} className="btn btn-danger">Remove from Cart</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          onClick={() => this.handleOrderCheckout()}
          className="btn btn-primary"
        >
          Place Order
        </button>
      </div>
    );
  }

  async removeOrder(orderId){
    await deleteOrderFromCart(this.state.cart._id,orderId);
    window.location="/cart";
    toast.success("Order Removed from the cart!")
  }

  async removeRental(rentalId){
    await deleteRentalFromCart(this.state.cart._id,rentalId);
    window.location="/cart";
   toast.success("Rental Removed from the cart!")
  }

  getStoreAddress = st => {
    return st.street + " " + st.city + " " + st.state + " " + st.zip;
  };
}

export default Cart;