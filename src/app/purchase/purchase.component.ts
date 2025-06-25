
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiService } from '../Services/api.service';

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
    const courseId = +this.route.snapshot.paramMap.get('id')!;
    this.apiService.getCourseById(courseId).subscribe({
      next: res => {
        this.course = res.course;
        this.purchaseForm.patchValue({ course_id: res.course.id });
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const customerId = localStorage.getItem('customer_id');
      console.log('customer_id from localStorage:', localStorage.getItem('customer_id'));
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

 onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Reset any previous errors
    const control = this.purchaseForm.get('pay_slip');
    control?.setErrors(null);

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      control?.setErrors({ invalidType: true });
      return;
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      control?.setErrors({ maxSize: true });
      return;
    }

    // Valid file – set to form and mark it valid
    this.purchaseForm.patchValue({ pay_slip: file });
    control?.updateValueAndValidity();
  }
}



 onSubmit(): void {
  console.log('Form data:', this.purchaseForm.value);
  console.log('File:', this.purchaseForm.get('pay_slip')?.value);

  if (this.purchaseForm.invalid) {
    this.purchaseForm.markAllAsTouched();
    Swal.fire('Error', 'Please upload a valid payment slip.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('customer_id', this.purchaseForm.get('customer_id')?.value);
  formData.append('course_id', this.purchaseForm.get('course_id')?.value);
  formData.append('payment_status', this.purchaseForm.get('payment_status')?.value);
  formData.append('pay_slip', this.purchaseForm.get('pay_slip')?.value);

  this.isSubmitting = true;

  this.apiService.uploadPayment(formData).subscribe({
    next: res => {
      Swal.fire('Success', res.message, 'success');
      this.purchaseForm.reset();
      this.closeModal();
      this.isSubmitting = false;
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
}
