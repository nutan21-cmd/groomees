import React, { Component } from "react";
import { getAllOrderDetailed } from '../services/orderService';


class Orders extends Component {
  state = { orders: [] };
  async componentDidMount() {
    const { data: orders } = await getAllOrderDetailed(this.props.user._id);
    const userOrders = orders.filter(
      order => order.customerID == this.props.user._id && order.status=="BOUGHT"
    );

    this.setState({orders:userOrders});
  }

  render() {
    const { orders } = this.state;
    return (
    <div>
        <h3>Completed Orders</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Store Address</th>
              <th>Date Of Purchase</th>
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
                  <td>{order.orderedDate}</td>

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

export default Orders;
