import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$: Observable<any> = this.userSubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
  );

  constructor() {
    this.loadUser();
  }

  loadUser() {
    const userData = localStorage.getItem('user');
    this.userSubject.next(userData ? JSON.parse(userData) : null);
  }

  updateUser(user: any) {
    const userCopy = user ? { ...user } : null; // Create a new object to ensure change detection
    console.log('Updating user:', userCopy); // Debug
    localStorage.setItem('user', JSON.stringify(userCopy));
    this.userSubject.next(userCopy);
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}