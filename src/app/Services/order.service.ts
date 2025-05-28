import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../guards/environment';

export interface ApiResponse {
  status: string;
  message: string;
  course?: any;
  ['Payment method']?: any[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})


export class OrderService {
private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCourseById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/courses/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getPaymentMethod(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/payment-methods`).pipe(
      catchError(this.handleError)
    );
  }

  submitPurchase(customerId: number, courseId: number, paySlip: string): Observable<ApiResponse> {
    const payload = { customer_id: customerId, course_id: courseId, pay_slip: paySlip };
    console.log('API payload:', payload);
    return this.http.post<ApiResponse>(`${this.apiUrl}/purchases`, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.error || `Error ${error.status}: ${error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
