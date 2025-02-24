import http from "./httpService";
import { apiUrl } from "../config.json";

export function getCustomerCart(customerId) {
  return http.get(apiUrl + "/carts/customer/"+customerId);
}

export function postEmptyCart(emptyCart) {
    return http.post(apiUrl + "/carts",emptyCart);
  }

export function addNewOrderToCart(cartId,OrderId){
    var url=apiUrl + "/carts/"+cartId+"/order"
    var obj={
        "orderId":OrderId     
    }
    return http.put(url,obj);
}


export function addToCart(bookID,storeID,customerID){
    var url=apiUrl+"/carts/addToCart";
    var obj={
        "customerID": customerID,
        "storeID": storeID,
        "bookID": bookID
        }
    return http.put(url,obj);
}

export function rentToCart(bookID,storeID,customerID){
    var url=apiUrl+"/carts/rentToCart";
    var obj={
        "customerID": customerID,
        "storeID": storeID,
        "bookID": bookID
        }
    return http.put(url,obj);
}

export function checkout(cartId){
    var url=apiUrl+"/carts/"+cartId+"/checkout"
    var obj={};
    return http.put(url,obj);
}

export function deleteOrderFromCart(cartId,orderId){
    var url=apiUrl+"/carts/"+cartId+"/order/"+orderId;
    return http.delete(url);
} 

export function deleteRentalFromCart(cartId,rentalId){
    var url=apiUrl+"/carts/"+cartId+"/rental/"+rentalId;
    return http.delete(url);
} 


//1.user press add to cart
//2. check if cart ==[] -->cart=orders[],rentals[]
//3. else cart.orders.put
