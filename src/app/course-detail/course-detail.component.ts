import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-course-detail',
  standalone: false,
  
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent {
  course: any;
  loading = true;

  constructor(private router: Router,private route: ActivatedRoute, private courseService: ApiService) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(+courseId).subscribe({
        next: res => {
          this.course = res.course;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
  onBuy(courseId: number) {
    if (this.courseService.isLoggedIn()) {
      this.router.navigate(['/purchase', courseId]);
    } else {
      Swal.fire({
        title: 'សូមចុះឈ្មោះ!',
        text: 'សូមចុះឈ្មោះមុនពេលទិញវគ្គសិក្សា។',
        icon: 'warning',
        confirmButtonText: 'ទៅកាន់ការចុះឈ្មោះ',
        showCancelButton: true,
        cancelButtonText: 'បោះបង់'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/signup']);
        }
      });
    }
  }
}
