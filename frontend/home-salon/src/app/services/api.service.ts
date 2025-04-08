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
}
