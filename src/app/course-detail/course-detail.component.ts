import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../Services/api.service';
import Swal from 'sweetalert2';
import { isBrowser } from '../utils/platform.util';
@Component({
  selector: 'app-course-detail',
  standalone: false,
  
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent {
  course: any= null;
  loading = true;
  isLogined: boolean = false;
   lessons: any[] = [];
  selectedLessonIndex: number | null = null;
  courseId!: number;
  isLoading = true;
  error: string | null = null;
  constructor(private router: Router,private route: ActivatedRoute, private courseService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    const id = +idParam;
    this.courseId = id;
    this.loadCourse(id);

    this.courseService.getLessonsByCourse(id).subscribe({
      next: (response) => {
        this.lessons = response.lesson;
      },
      error: (error) => {
        // console.error('Error fetching lessons:', error);
        console.log('Error fetching lessons:',error);
      }
    });
  } else {
    console.error('No course ID found in route');
  }

  this.checkLoginStatus();
  }
  toggleVideo(index: number): void {
    this.selectedLessonIndex = this.selectedLessonIndex === index ? null : index;
  }
  trackByLessonId(index: number, lesson: any): number {
  return lesson.id;
}
  private loadCourse(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe({
      next: res => {
        this.course = res.course;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading course:', err);
        this.loading = false;
      }
    });
  }

  private checkLoginStatus() {
    if (isBrowser()) {
      const token = localStorage.getItem('token'); // Use consistent key 'token'
      this.isLogined = !!token;
      // No need to redirect here, wait until user clicks "Buy"
    }
  }

  onBuy(courseId: number) {
    if (this.isLogined) {
      // If user already logged in, go straight to purchase
      this.router.navigate(['/purchase', courseId]);
    } else {
      // Save where the user wanted to go
      localStorage.setItem('redirectAfterLogin', `/purchase/${courseId}`);
      Swal.fire({
        title: 'សូមចុះឈ្មោះ!',
        text: 'សូមចុះឈ្មោះមុនពេលទិញវគ្គសិក្សា។',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'ទៅកាន់ការចុះឈ្មោះ',
        denyButtonText: 'ទៅកាន់ការចុះឈ្មោះថ្មី',
        showCancelButton: true,
        cancelButtonText: 'បោះបង់'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        } else if (result.isDenied) {
          this.router.navigate(['/signup']);
        }
      });
    }
  }

 


}
