import React, { Component } from "react";
import _ from 'lodash';
class GenericPagination extends Component {

    getPageClass=(page)=>{
        if(page === this.props.currentPage)
        return "page-item active" 
        return "page-item"
    }

    render() {
        const totalItems=this.props.totalItems;
        const itemsPerPage=this.props.itemsPerPage;
        const numberOfPages= Math.ceil(totalItems / itemsPerPage);
        if (numberOfPages === 1) return null;
        const pages = _.range(1, numberOfPages + 1);

    return (
      <nav>
        <ul className="pagination" id="BigPage">
            {pages.map(page=>(
                 <li key={page} className={this.getPageClass(page)}>
                 <a className="page-link" onClick={() => this.props.onPageChange(page)}>{page}</a>
               </li>
            ))}
         
        </ul>
      </nav>
    );
  }
}

export default GenericPagination;
