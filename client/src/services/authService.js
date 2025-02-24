import http from "./httpService";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode";


const tokenKey = "token";
const apiEndpoint = apiUrl + "/auth";

//http.setJwt(getJwt());


console.log("In auth");
export function loginAndStoreJWT(jwt) {
    localStorage.setItem(tokenKey, jwt);
  }

  export function getCurrentUser() {
    try {
      const jwt = localStorage.getItem(tokenKey);
      return jwtDecode(jwt);
    } catch (ex) {
      return null;
    }
  }

  export async function login(email, password) {
    const { data: jwt } = await http.post(apiEndpoint, { email, password });
    localStorage.setItem(tokenKey, jwt);
  }

  export function getJwt() {
    return localStorage.getItem(tokenKey);
  }

  export function logout() {
    localStorage.removeItem(tokenKey);
  }