import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  standalone: false,
  
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
username: string = '';
  email: string = '';
  gender: string = 'male';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.showAlert('Password Mismatch', 'Passwords do not match. Please try again.', 'error');
      return;
    }

    this.loading = true;

    const userData = {
      username: this.username,
      email: this.email,
      gender: this.gender,
      phone: this.phone,
      password: this.password
    };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.showAlert(
          'Registered Successfully!',
          'You have successfully registered.',
          'success',
          'Go to Login'
        ).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        this.loading = false;
        const err = error.error?.errors;

        if (err?.phone) {
          this.showAlert('Phone Exists!', err.phone[0], 'error');
        } else {
          this.showAlert(
            'Registration Failed',
            error.error?.message || 'Please check your input and try again.',
            'error'
          );
        }
      }
    });
  }

  // 🔔 Reusable SweetAlert2 function
  showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info', confirmText: string = 'OK') {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: icon === 'success' ? '#3085d6' : '#d33',
      confirmButtonText: confirmText
    });
  }
}
