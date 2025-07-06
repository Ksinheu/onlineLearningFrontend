
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiService } from '../Services/api.service';
declare global {
  interface Window {
    Compressor: any;
  }
}

@Component({
   selector: 'app-purchase',
  standalone: false,
  
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})

export class PurchaseComponent implements OnInit {
  
 purchaseForm: FormGroup;
  isLogined = false;
  course: any = null;
  isSubmitting = false;
  showModal = false;
  loading = true;
  payment_methods: any;
  formData = new FormData();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.purchaseForm = this.fb.group({
      customer_id: ['', Validators.required],
      course_id: ['', Validators.required],
      payment_status: ['pending'],
      pay_slip: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('id');
    const courseId = courseIdParam ? +courseIdParam : null;

    if (!courseId || isNaN(courseId)) {
      Swal.fire('Error', 'Invalid course ID', 'error');
      this.router.navigate(['/']);
      return;
    }

    this.apiService.getCourseById(courseId).subscribe({
      next: res => {
        this.course = res.course;
        this.purchaseForm.patchValue({ course_id: res.course.id });
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'Failed to load course.', 'error');
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const customerId = localStorage.getItem('customer_id');
      const token = localStorage.getItem('token');
      this.isLogined = !!token;
      if (customerId) {
        this.purchaseForm.patchValue({ customer_id: +customerId });
      }
    }

    this.apiService.getPaymentMethod().subscribe({
      next: res => {
        this.payment_methods = res['Payment_method'];
      },
      error: err => {
        console.error(err);
      }
    });
  }

  openModal(): void {
    if (!this.isLogined) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to proceed.',
        confirmButtonText: 'OK'
      }).then(() => this.router.navigate(['/login']));
      return;
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onFileSelected(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(`Selected file for ${field}:`, file);

      new window.Compressor(file, {
        quality: 0.6,
        success: (compressedResult: Blob) => {
          this.formData.set(field, compressedResult);
          this.purchaseForm.patchValue({ [field]: compressedResult });
          console.log(`Compressed file added to FormData for ${field}:`, compressedResult);
        },
        error(err: any) {
          console.error('Error compressing the file:', err.message);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      Swal.fire('Error', 'Please upload a valid payment slip.', 'error');
      return;
    }

    this.formData.set('customer_id', this.purchaseForm.get('customer_id')?.value);
    this.formData.set('course_id', this.purchaseForm.get('course_id')?.value);
    this.formData.set('payment_status', this.purchaseForm.get('payment_status')?.value);

    this.isSubmitting = true;

    this.apiService.uploadPayment(this.formData).subscribe({
      next: res => {
         Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.message,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          this.purchaseForm.reset();
          this.formData = new FormData();
          this.closeModal();
          this.isSubmitting = false;
          this.router.navigate(['/myLesson']); // ✅ Navigate on confirm
        }
      });
      },
      error: err => {
        console.error(err);
        Swal.fire('Error', 'Failed to submit payment.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  hasError(field: string): boolean {
    const control = this.purchaseForm.get(field);
    return !!control && control.touched && control.invalid;
  }

  logout(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.forceLogout('Already Logged Out', 'No token found. You are already logged out.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.apiService.Logout().subscribe({
          next: () => {
            this.clearSession();
            this.apiService.clearUser();
            this.apiService.isLoggedIn.next(false);
            this.forceLogout('Logged Out', 'You have successfully logged out.', 'success');
          },
          error: (error) => {
            console.error('Logout error:', error);
            this.clearSession();
            this.apiService.clearUser();
            this.apiService.isLoggedIn.next(false);
            this.forceLogout('Logout Failed', 'There was an issue logging out. You were redirected anyway.', 'error');
          },
          complete: () => {
            this.apiService.isLoggedIn.next(false);
          }
        });
      }
    });
  }

  private forceLogout(title: string, text: string, icon: 'success' | 'error' | 'warning') {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#3085d6',
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
    localStorage.removeItem('customer_id');
  }
}
