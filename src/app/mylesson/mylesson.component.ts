import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mylesson',
  standalone: false,
  templateUrl: './mylesson.component.html',
  styleUrl: './mylesson.component.css'
})
export class MylessonComponent implements OnInit{
  completedCourses: any[] = [];
  pendingCourses: any[] = [];
  loading = false;
  customerId!: number;

  showModal = false;
  @Input() courseId!: number; // Get this from parent
  commentForm: FormGroup;
  isSubmitting = false;
  successMessage = '';

  constructor(private purchaseService: ApiService,private fb:FormBuilder,) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.customerId = Number(localStorage.getItem('customer_id')); // adjust to your auth logic
    if (this.customerId) {
      this.loadCompletedCourses();
    }
  }

  loadCompletedCourses() {
    this.loading = true;
    this.purchaseService.getCompletedCourses(this.customerId).subscribe({
      next: res => {
        this.completedCourses = res.completed || [];
        console.log(this.completedCourses)
        this.pendingCourses = res.pending || [];
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load courses:', err);
        this.loading = false;
      }
    });
  }
  openCommentModal(courseId: number) {
    this.courseId = courseId;
    this.commentForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.successMessage = '';
  }

   onSubmit() {
     if (this.commentForm.invalid || !this.courseId) return;

    const customerId = Number(localStorage.getItem('customer_id'));
    const commentData = {
      course_id: this.courseId,
      customer_id: customerId,
      comment: this.commentForm.value.comment
    };

    this.isSubmitting = true;

    this.purchaseService.submitComment(commentData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.isSubmitting = false;
        setTimeout(() => this.closeModal(), 2000); // Auto close
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  
  }

}
