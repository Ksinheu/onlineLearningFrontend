import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Check if we're running in the browser
    // if (isPlatformBrowser(this.platformId)) {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     return true;
    //   }
    // }
    
    // If not in browser or no token, redirect to login
    // this.router.navigate(['/login']);
    return true;
  }
}
