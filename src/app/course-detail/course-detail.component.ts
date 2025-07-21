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
  course: any = null;
  loading = true;
  isLogined: boolean = false;
  lessons: any[] = [];
  selectedLessonIndex: number | null = null;
  courseId!: number;
  contents: any[] = [];
  isLoading = true;
  error: string | null = null;
  constructor(private router: Router, private route: ActivatedRoute, private courseService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.courseId = id;
      this.loadCourse(id);
      this.courseService.getLessonsByCourse(id).subscribe({
        next: (response) => {
          this.lessons = response.lesson;
          console.log(response)
        },
        error: (error) => {
          // console.error('Error fetching lessons:', error);
          console.log('Error fetching lessons:', error);
        }
      });
    } else {
      console.error('No course ID found in route');
    }
    this.isLogined = this.courseService.isAuthenticated();
    this.checkLoginStatus();
    this.loadContents();
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
  loadContents(): void {
    this.courseService.getContents(this.courseId).subscribe({
      next: (response) => {
        this.contents = response.content;
      },
      error: (error) => {
        console.error('Failed to load content:', error);
      }
    });
  }

  logout() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.forceLogout('Already Logged Out', 'No token found. You are already logged out.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        if (!token) {
          this.forceLogout('Already Logged Out', 'No token found. You are already logged out.', 'warning');
          return;
        }

        this.courseService.Logout().subscribe({
          next: () => {
            this.clearSession();
            this.courseService.clearUser();
            this.courseService.isLoggedIn.next(false);
            this.forceLogout('Logged Out', 'You have successfully logged out.', 'success');
          },
          error: (error) => {
            console.error('Logout error:', error);
            this.clearSession();
            this.courseService.clearUser();
            this.courseService.isLoggedIn.next(false);
            this.forceLogout('Logout Failed', 'There was an issue logging out. You were redirected anyway.', 'error');
          },
          complete: () => {
            this.courseService.isLoggedIn.next(false);
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

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
  }

}
