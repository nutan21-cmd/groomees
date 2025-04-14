// src/app/services/user.service.ts
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
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}