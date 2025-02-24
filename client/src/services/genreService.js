import http from "./httpService";
import { apiUrl } from "../config.json";

export function getAllGenres() {
  return http.get(apiUrl + "/genres");
}
