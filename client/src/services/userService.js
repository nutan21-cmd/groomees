import http from "./httpService";
import { apiUrl } from "../config.json";
import moment from "moment";

export function getAllReaders() {
  return http.get(apiUrl + "/users/readers");
}

export function getAllAuthors() {
    return http.get(apiUrl + "/users/authors");
  }

  export function getAllOwners() {
    return http.get(apiUrl + "/users/owners");
  }

  export function getUserById(id) {
    return http.get(apiUrl + "/users/"+id);
  }

  export function getAllUsers() {
    return http.get(apiUrl + "/users");
  }

  export function updateUser(id,user) {
    return http.put(apiUrl + "/users/"+id,user);
  }

  export function createUser(user) {
    return http.post(apiUrl + "/users",user);
  }

  export function deleteUser(id) {
    return http.delete(apiUrl + "/users/"+id);
  }

  export function addFollower(id,personId) {
    return http.put(apiUrl + "/users/"+id+"/follow/"+personId);
  }
    export function removeFollower(id,personId) {
        return http.delete(apiUrl + "/users/"+id+"/unfollow/"+personId);
      }

      export function getFollowers(id) {
        return http.get(apiUrl + "/users/"+id+"/followers");
      }    
      
      
      export function getFollowing(id) {
        return http.get(apiUrl + "/users/"+id+"/following");
      } 

      export function postFeedToUser(id,feed) {
          const body={"feed":feed};
        return http.put(apiUrl + "/users/"+id+"/feeds",body);
      }

      export function postFeedToAllFollowers(id,feed) {
        const body={"feed":moment().format("lll")+" : "+ feed};
      return http.put(apiUrl + "/users/"+id+"/updateFollowers",body);
    }

    export function register(user) {
        return http.post(apiUrl + "/users/register",user);
      }

