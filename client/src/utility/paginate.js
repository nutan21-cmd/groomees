import _ from "lodash";

 const paginate=(totalItems, currentPage, itemsPerPage) =>{
  const startIndex = (currentPage - 1) * itemsPerPage;
  var sliced= _(totalItems).slice(startIndex);
    var onPage =sliced.take(itemsPerPage);
    return onPage.value();
}

export default paginate;