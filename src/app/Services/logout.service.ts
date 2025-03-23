import { isPlatformBrowser } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  // constructor() { }
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedInSubject.next(!!localStorage.getItem('token'));
    }
  }

  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.isLoggedInSubject.next(true);
    }
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
      }
      observer.next({ success: true });
      observer.complete();
    });
  }
}
