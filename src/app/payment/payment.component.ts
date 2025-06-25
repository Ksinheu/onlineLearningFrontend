import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  customer_id = '';
  course_id = '';
  payment_status = 'pending';
  pay_slip: File | null = null;
  courses: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    // Get logged-in customer info from localStorage
    const user = localStorage.getItem('user');
   
    if (user) {
      const parsedUser = JSON.parse(user);
      this.customer_id = parsedUser.id; // adjust based on your stored user object
    } else {
      Swal.fire('Login Required', 'Please login first.', 'warning').then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    // Load available courses
    this.apiService.getCourse().subscribe({
      next: (res) => {
        this.courses = res.courses || res; // adapt if the API wraps data
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        Swal.fire('Error', 'Unable to fetch courses.', 'error');
      }
    });
  }

  onFileChange(event: any) {
    this.pay_slip = event.target.files[0];
  }

  submitPayment() {
    if (!this.pay_slip) {
      Swal.fire('Error', 'Please select a payslip image.', 'error');
      return;
    }

    if (!this.customer_id || !this.course_id) {
      Swal.fire('Error', 'Missing customer or course selection.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('customer_id', this.customer_id);
    formData.append('course_id', this.course_id);
    formData.append('payment_status', this.payment_status);
    formData.append('pay_slip', this.pay_slip);

    this.apiService.uploadPayment(formData).subscribe({
      next: (res) => {
        Swal.fire('Success', res.message, 'success');
        this.course_id = '';
        this.payment_status = 'pending';
        this.pay_slip = null;
      },
      error: (err) => {
        Swal.fire('Error', 'Error uploading payment', 'error');
        console.error(err);
      }
    });
  }
}
