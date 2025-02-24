import http from "./httpService";
import { apiUrl } from "../config.json";

export function getAllOrdersOfCustomer(customerId) {
  return http.get(apiUrl + "/orders/customer/"+customerId);
}

export function post(emptyCart) {
    return http.post(apiUrl + "/carts",emptyCart);
  }

export function updateOrder(orderId,quantity,status){
    var url=apiUrl+ "/orders/"+orderId+"/updateOrder";
    var obj={
        "quantity": quantity,
        "status": status
    }
    return http.put(url,obj);
}  

export function postNewOrder(userId,bookId,storeId){
    var url=apiUrl+ "/orders";
    const orderObject={
        "customerID": userId,
              "storeID": storeId,
              "bookID": bookId,
              "status": "ADDED TO CART",
              "quantity": 1
      };
    return http.post(url,orderObject);
}  

export function getAllOrderDetailed(){
    var url=apiUrl+ "/orders/detailed";
    return http.get(url);
} 

export function getAllRentalDetailed(){
    var url=apiUrl+ "/rentals/detailed";
    return http.get(url);
} 


//1.user press add to cart
//2. check if cart ==[] -->cart=orders[],rentals[]
//3. else cart.orders.put
