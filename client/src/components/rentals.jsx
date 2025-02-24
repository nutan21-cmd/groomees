import React, { Component } from "react";
import { getAllOrderDetailed, getAllRentalDetailed } from '../services/orderService';


class Rentals extends Component {
  state = { orders: [] };
  async componentDidMount() {
    const { data: orders } = await getAllRentalDetailed(this.props.user._id);
    const userOrders = orders.filter(
      order => order.customerID == this.props.user._id && order.status=="RENTED"
    );

    this.setState({orders:userOrders});
  }

  render() {
    const { orders } = this.state;
    return (
    <div>
        <h3>Completed Rentals</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Daily Rental Rate</th>
              <th>Store Address</th>
              <th>Start Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              return (
                <tr key={order._id}>
                  <td>{order.bookID.title}</td>
                  <td>{order.quantity}</td>
                  <td>{"$" + order.dailyRentalRate}</td>
                  <td>
                    {this.getStoreAddress(order.storeID.owner.addresses[0])}
                  </td>
                  <td>{order.startDate}</td>
                  <td>{order.returnDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
    );
  }

  getStoreAddress = st => {
    return st.street + " " + st.city + " " + st.state + " " + st.zip;
  };
}

export default Rentals;
