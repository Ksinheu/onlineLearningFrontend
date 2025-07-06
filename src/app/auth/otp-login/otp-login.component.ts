import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-login',
  standalone: false,
  templateUrl: './otp-login.component.html',
  styleUrl: './otp-login.component.css'
})
export class OtpLoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit(): void {
    const email = localStorage.getItem('otp_email');
    if (email) {
      this.form.patchValue({ email }); // autofill email if found
    }
  }
  submit() {
    if (this.form.invalid) return;

    this.api.postOtp('otp-login', this.form.value).subscribe({
      next: (res: any) => {
        Swal.fire('Success', res.message, 'success');
        localStorage.setItem('token', res.token); // store token
        this.router.navigate(['/dashboard']); // redirect to a protected route
      },
      error: err => {
        Swal.fire('Error', err.error.message || 'Invalid OTP', 'error');
      }
    });
  }
}
