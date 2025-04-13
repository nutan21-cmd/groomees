import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`)  }

  getTreatments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/treatments`)
  }

  getTreatmentsbyCategory(id:string): Observable<any> {
    // return this.http.get(${this.apiUrl}/categories/${id}/treatments` })
          return this.http.get(`${this.apiUrl}/categories/${id}/treatments`);
  }

  getTreatmentBooking(id:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/treatments/${id}`);
  }

  sendOtp(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/twilio/send-otp`, { phone });
  }
  
  verifyOtp(phone: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/twilio/verify-otp`, { phone, code });
  }

  updateUserProfile(payload:any,id:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${id}`,  payload );
  }
  registerUser(payload:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`,  payload );
  }

  createBooking(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/create`, payload);
  }

  getServicesHistory(id:string): Observable<any> {
    const apiUrl = `${this.apiUrl}/bookings/user/${id}`; // Replace with your actual API endpoint
    return this.http.get(apiUrl);
  }
  cancelBooking(bookingId: string): Observable<any> {
    const cancelUrl = `${this.apiUrl}/bookings/${bookingId}/cancel`;
    return this.http.put(cancelUrl, {});
  }

  createCategory(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, payload);
  }

  updateCategory(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, payload);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  // Treatments APIs


  createTreatment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/treatments`, payload);
  }

  updateTreatment(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/treatments/${id}`, payload);
  }

  deleteTreatment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/treatments/${id}`);
  }

  getTreatmentsByCategory(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${id}/treatments`);
  }

  getAllUsersBooking(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/all-users-with-bookings`)
  }

  updateUser(userId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/user/${userId}`, updatedData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/user/${userId}`);
  }

  updateBookings(bookingId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/${bookingId}`, updatedData);
  }

  deleteBookings(bookingId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${bookingId}`);
  }

  resheduleBookings(bookingId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bookings/reshedule/${bookingId}`, updatedData);
  }

  getBookingDetails(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/${bookingId}`);
  }
}
