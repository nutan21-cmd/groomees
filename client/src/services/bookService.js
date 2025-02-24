import http from "./httpService";
import { apiUrl } from "../config.json";

let apiEndpoint = apiUrl;


export function getbooksFromAllBookstores() {
  return http.get(apiEndpoint+"/bookstores/books");
}

export function getAllBooks() {
    return http.get(apiEndpoint+"/books");
  }

  export function getBookById(id) {
    return http.get(apiEndpoint+"/books/"+id);
  }

  export function getBookByGenre(genre) {
    return http.get(apiEndpoint+"/books/genre/"+genre);
  }
