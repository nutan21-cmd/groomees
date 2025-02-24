import React, { Component } from 'react';
import { getAllBookstores } from '../services/bookstoreService';
import { Link } from 'react-router-dom';
class Stores extends Component {
    state = { stores:[] }

    async componentDidMount() {
        const { data: stores } = await getAllBookstores();
        this.setState({stores });
      }

    render() { 
        return (<React.Fragment>
             <div className="row">
          <h1>Existing Bookstores</h1>
        </div>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Owner Name</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </React.Fragment>  );
    }

    getFullName = author => {
        return author.firstName + " " + author.lastName;
      };
}
 
export default Stores;