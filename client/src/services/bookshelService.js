import http from "./httpService";
import { apiUrl } from "../config.json";

let apiEndpoint = apiUrl + "/bookshelf";

export function getBookshelfByPersonId(id) {
  return http.get(apiEndpoint+"/"+id);
}
export function getBookshelfByPersonIdDetailed(id) {
  return http.get(apiEndpoint+"/"+id+"/detailed");
}

export function updateBookShelf(personId,updatedDetail) {
    return http.put(apiEndpoint+"/"+personId+"/add",updatedDetail);
  }

  export function getAllreviewsforBook(bookId) {
    return http.get(apiEndpoint+"/review/"+bookId);
  }

  