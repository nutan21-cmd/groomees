import React, { Component } from "react";
import { getbooksFromAllBookstores, getBookByGenre } from "../services/bookService";
import { getAllGenres } from "../services/genreService";
import GenericPagination from "./common/genericPagination";
import paginate from "../utility/paginate";
import FilterList from "./common/filterList";
import SearchBoxInput from "./common/searchBoxInput";
import { Link } from 'react-router-dom';
import  ReactLoading  from 'react-loading';
import { addInventoryToBookstore } from "../services/bookstoreService";

class Books extends Component {
  state = {
    books: [],
    genres: [],
    currentPage: 1,
    itemsPerPage: 20,
    titleQuery: "",
    authorQuery: "",
    storeQuery:"",
    selectedGenre: null,
    done:false
  };

  async componentDidMount() {
    const genres = await getAllGenres();
    const dbGenres = genres.data;
    const allGenres = ["All Genres", ...dbGenres];

    const { data } = await getbooksFromAllBookstores();
    console.log("Books mounting..");
    this.setState({ books: data, genres: allGenres,done:true });
  }

  getDataOnCurrentPage = () => {
    //1.searchquery
    //2.filter by genre--get totalcount
    //3. paginate

    let titleQueryFiltered = [...this.state.books];
    if (this.state.titleQuery != "")
      //if there is a query
      titleQueryFiltered = this.state.books.filter(b =>
        b.title.toUpperCase().includes(this.state.titleQuery.toUpperCase())
      );

    let authorFiltered = titleQueryFiltered;
    if (this.state.authorQuery != "")
      authorFiltered = titleQueryFiltered.filter(b =>
        this.getFullName(b.author)
          .toUpperCase()
          .includes(this.state.authorQuery.toUpperCase())
      );

      let storeFiltered = authorFiltered;
      if (this.state.storeQuery != "")
      storeFiltered = authorFiltered.filter(b =>
          b.storeName
            .toUpperCase()
            .includes(this.state.storeQuery.toUpperCase())
        );  

    let genreFiltered = storeFiltered;
    if (this.state.selectedGenre && this.state.selectedGenre != "All Genres") {
      genreFiltered = storeFiltered.filter(
        book => book.genre == this.state.selectedGenre
      );
    }
    const totalCount = genreFiltered.length;

    const books = paginate(
      genreFiltered,
      this.state.currentPage,
      this.state.itemsPerPage
    );
    return { totalCount, books };
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = selectedGenre => {
    this.setState({ selectedGenre, currentPage: 1 });
  };

  handleTitleSearch = q => {
    this.setState({ titleQuery: q, currentPage: 1 });
  };

  handleAuthorSearch = q => {
    this.setState({ authorQuery: q, currentPage: 1 });
  };

  handleStoreSearch = q => {
    this.setState({ storeQuery: q, currentPage: 1 });
  };

  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };

  handleBooksHack=async ()=>{
    const alreadyAdded=["5dcf3edf5314ad060dbd6a52","5dcf3edf5314ad060dbd69ce","5dcf3edf5314ad060dbd6a47","5dcf3edf5314ad060dbd69e8"]
    const storeIds=["5de0b06e9a3df3c4d6f00ef5","5ded8d3b1a2a12247874dea1","5ded85b71a2a12247874dea0","5dee6ac7672991342c810248","5ded46bc45d8c174b540f256"];
    const {data:books}=await getBookByGenre("Non-Fiction");
    //const filtered=books.filter(b=>!alreadyAdded.includes(b._id))
    const filtered=books;
    console.log(filtered);
    
    for(var i=0;i<6;i++){    
      for(var j=0;j<5;j++){
        let obj = {
          bookID: filtered[i]._id,
          quantity: 100,
          price: 10+i/2+j/2
        };
        await addInventoryToBookstore(storeIds[j],obj)
      }
    }
    window.location="/books";
    //alert("done");
  }

  render() {

    if(!this.state.done)
    return <div className="row">
        <div className="col">
        <ReactLoading type={"bars"} color={"black"}/>
        <h2>Loading.... Please wait</h2>
        </div>
    </div> 

    const count = this.state.books.length;
  if (count === 0) return <p>No Books found.</p>;

    const pagedData = this.getDataOnCurrentPage();
    const totalCount = pagedData.totalCount;
    const pagedBooks = pagedData.books;
    return (
      <React.Fragment>
      <div className="row m-2">
        <div className="col">
          <h2>Books available in the stores</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-2">
          <FilterList
            choices={this.state.genres}
            selectedChoice={this.state.selectedGenre}
            onChoiceSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>{totalCount} Books found.</p>
          <div className="row">
            <div className="col-3">
              <SearchBoxInput
                placeholder="Enter Title..."
                value={this.state.titleQuery}
                onChange={this.handleTitleSearch}
              />
            </div>
            <div className="col-3">
              <SearchBoxInput
                placeholder="Enter Author..."
                value={this.state.authorQuery}
                onChange={this.handleAuthorSearch}
              />
            </div>
            <div className="col-3">
              <SearchBoxInput
                placeholder="Store Name"
                value={this.state.storeQuery}
                onChange={this.handleStoreSearch}
              />
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Author</th>
                <th>Rating</th>
                <th>Store Name</th>
              </tr>
            </thead>
            <tbody>
              {pagedBooks.map(book => (
                <tr key={book._id + book.storeID}>
                  <td><Link to={`/books/${book._id}/${book.storeID}`}>{book.title}</Link></td>
                  <td>{book.genre}</td>
                  <td>{this.getFullName(book.author)}</td>
                  <td>{Math.round(book.rating.averageRating * 100) / 100}</td>
                  <td>{book.storeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <GenericPagination
            totalItems={totalCount}
            itemsPerPage={this.state.itemsPerPage}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
          />
      </React.Fragment>
    );
  }
}

export default Books;
