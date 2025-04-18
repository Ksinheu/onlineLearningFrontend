import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl= 'http://127.0.0.1:8000/api';
  private sliderApi = 'http://localhost:8000/api/sliderApi';
  private courseApi = 'http://localhost:8000/api/courseApi';
  private lessonApi = 'http://localhost:8000/api/lessonApi';
  // private newsApi='http://localhost:8000/api/newsApi';
  constructor(private http:HttpClient, private router:Router,
     @Inject(PLATFORM_ID) private platformId: object) { }
  
  register(data: any): Observable<any> {
    const deviceInfo = this.collectDeviceInfo();
    const fullData = {
      ...data,
      ...deviceInfo
    };

    return this.http.post<any>(`${this.apiUrl}/customerRegister`, fullData);
  }
  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn1(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  Login(email:string, password:string): Observable<any> {
    const loginData={
      email:email,
      password:password
    }
    this.loggedIn.next(true);
    return this.http.post<any>(`${this.apiUrl}/login`,loginData);
  }
  logout(): Observable<any> {
    this.loggedIn.next(false);
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
  
  clearSession(): void {
    localStorage.removeItem('token'); // Remove the token
    sessionStorage.clear(); // Clear session storage
    this.router.navigate(['/login']); // Redirect to login page
  }

  private collectDeviceInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Browser detection using regular expressions
    const browserMap = {
        'Chrome': /Chrome\/(\S+)/,
        'Firefox': /Firefox\/(\S+)/,
        'MSIE': /MSIE (\S+);/,
        'Edge': /Edge\/(\S+)/,
        'Safari': /Version\/(\S+) Safari\//
    };

    // Iterate over browserMap to find a match for the current browser
    for (const [name, regex] of Object.entries(browserMap)) {
        const match = userAgent.match(regex);
        if (match) {
            browserName = name;
            browserVersion = match[1];
            break;
        }
    }

    // Attempt to detect the operating system from navigator.platform
    const osMatch = /Windows|Mac|Linux/.exec(navigator.platform);
    const operatingSystem = osMatch ? osMatch[0] : 'Unknown';

    return {
        device_type: navigator.platform,
        operating_system: operatingSystem,
        browser_name: browserName,
        browser_version: browserVersion,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        ip_address: '127.0.0.1', // Placeholder, actual IP should be collected server-side
        location: 'Unknown', // Placeholder, precise location should be handled more securely
        // last_used: new Date().toISOString()
    };
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // or 'auth_user', etc.
  }
  // slider api
  getSliders(): Observable<any> {
    return this.http.get<any>(this.sliderApi);
  }
  // slider api
  getNews(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/newsApi');
  }
  // get course
  getCourse():Observable<any>{
    return this.http.get<any>(this.courseApi);
  }
  getCourseById(id: number): Observable<any> {
    return this.http.get(`${this.courseApi}/${id}`);
  }
  // get lession
  getLesson():Observable<any>{
    return this.http.get<any>(this.lessonApi);
  }

}
