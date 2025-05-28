
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl= 'http://127.0.0.1:8000/api';
  // private logoutUrl= 'http://127.0.0.1:8000/api/logout';
  private sliderApi = 'http://localhost:8000/api/sliderApi';
  private courseApi = 'http://localhost:8000/api/courseApi';
  // private lessonApi = 'http://localhost:8000/api/lessonApi';
  
  // private newsApi='http://localhost:8000/api/newsApi';
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getUserFromStorage());

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this.isLoggedInSubject;
  }
  constructor(private http:HttpClient, private router:Router,
     @Inject(PLATFORM_ID) private platformId: object) { 
      
     }

  register(data: any): Observable<any> {
    const deviceInfo = this.collectDeviceInfo();
    const fullData = {
      ...data,
      ...deviceInfo
    };
    return this.http.post<any>(`${this.apiUrl}/customerRegister`, fullData);
  }
  private loggedIn1 = new BehaviorSubject<boolean>(false);

  
  
  Login(email: string, password: string): Observable<any> {
    this.loggedIn1.next(true);
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  
  }


  Logout(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) return throwError(() => new Error('No token found'));

  return this.http.post(`${this.apiUrl}/logout`, {}, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
  });
}

  clearSession(): void {
  localStorage.removeItem('token'); // Remove the token
  sessionStorage.clear(); // Clear session storage
  this.isLoggedInSubject.next(false);
  this.router.navigate(['/login']); // Redirect to login page
}

  private getUserFromStorage(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('customer');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  setCurrentUser(customer: any) {
    this.currentUserSubject.next(customer);
    localStorage.setItem('customer', JSON.stringify(customer));
  }

  clearUser() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('customer');
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
  // private isLoggedInSubject = new BehaviorSubject<boolean>(false);



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
 getLessonById(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/lessonApi`);
}

getLessonsByCourse(courseId: number): Observable<any> {
  return this.http.get(`http://127.0.0.1:8000/api/lessons/course/${courseId}`);
}
  // get payment method
  getPaymentMethod():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/payment_method`);
  }
 private Url = 'http://127.0.0.1:8000/api/payment';
   uploadPaySlip(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // if using Bearer token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.Url, formData, { headers });
  }


  // Method to send order/payment
  makePayment(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/payment`, body, { headers });
  }


}
