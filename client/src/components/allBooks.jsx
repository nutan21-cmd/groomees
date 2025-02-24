import React, { Component } from "react";
import { getAllBooks } from "../services/bookService";
import { getAllGenres } from "../services/genreService";
import GenericPagination from "./common/genericPagination";
import paginate from "../utility/paginate";
import FilterList from "./common/filterList";
import SearchBoxInput from "./common/searchBoxInput";
import { Link } from 'react-router-dom';
import isoLangs from "../utility/language";
import  ReactLoading from 'react-loading';

class AllBooks extends Component {
  state = {
    books: [],
    genres: [],
    currentPage: 1,
    itemsPerPage: 25,
    titleQuery: "",
    authorQuery: "",
    languageQuery:"",
    selectedGenre: null,
    done:false
  };

  async componentDidMount() {
    const genres = await getAllGenres();
    const dbGenres = genres.data;
    const allGenres = ["All Genres", ...dbGenres];

    const { data } = await getAllBooks();
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

      let languageFiltered = authorFiltered;
    if (this.state.languageQuery != "")
    languageFiltered = authorFiltered.filter(b =>
        this.getLanguage(b.language)
          .toUpperCase()
          .includes(this.state.languageQuery.toUpperCase())
      );

    let genreFiltered = languageFiltered;
    if (this.state.selectedGenre && this.state.selectedGenre != "All Genres") {
      genreFiltered = languageFiltered.filter(
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

  handleLanguageSearch = q => {
    this.setState({ languageQuery: q, currentPage: 1 });
  };

  handleAuthorSearch = q => {
    this.setState({ authorQuery: q, currentPage: 1 });
  };

  getFullName = author => {
    return author.firstName + " " + author.lastName;
  };

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
          <h2>All Published Books..Add these books to Bookstores</h2>
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
          <h4>{totalCount} Books found.</h4>
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
                placeholder="Enter language..."
                value={this.state.languageQuery}
                onChange={this.handleLanguageSearch}
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
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {pagedBooks.map(book => (
                <tr key={book._id + book.storeID}>
                  <td><Link to={`/admin/books/${book._id}`}>{book.title}</Link></td>
                  <td>{book.genre}</td>
                  <td>{this.getFullName(book.author)}</td>
                  <td>{Math.round(book.rating.averageRating * 100) / 100}</td>                  <td>{this.getLanguage( book.language)}</td>
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
  getLanguage(code){
    return code;
    //return isoLangs[code].name;
  }
}

export default AllBooks;
