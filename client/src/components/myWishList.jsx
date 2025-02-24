import React, { Component } from "react";
import { getBookshelfByPersonId, getBookshelfByPersonIdDetailed } from "../services/bookshelService";
import { Link } from 'react-router-dom';
class MyWishList extends Component {
  state = { books: [] };

  async componentDidMount() {
    const { data: shelf } = await getBookshelfByPersonIdDetailed(this.props.user._id);
    console.log(shelf);

    const details = shelf.details.filter(d => d.status == "WANTS TO READ");
    const booksWAnts=details.map(d=>d.bookID);

    this.setState({ books: booksWAnts });
  }
  render() {
      
    return (
      <div>
        <h2>My Wish List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {this.state.books.map(book => (
              <tr key={book._id}>
                <td>                
                    {book.title}
                </td>
                <td>{book.genre}</td>
                <td>{book.rating.averageRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };
  
}

export default MyWishList;
