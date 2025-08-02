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
  groupedContents: any[] = [];
  isLoading = true;
  activeSection: string = 'description';
  error: string | null = null;
  errorMessage = '';
  comments: any[] = [];
countContent: number = 0;
  lessonCount: number  = 0;
  commentCount: number = 0;
  constructor(private router: Router, private route: ActivatedRoute, private courseService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit() {
  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    const id = +idParam;
    this.courseId = id;
    this.loadCourse(id);
    this.loadContents(); // <- load contents now
    this.loadComments();
    // this.courseService.getLessonsByCourse(id).subscribe({
    //   next: (response) => {
    //     // console.log(response);
    //   },
    //   error: (error) => {
    //     console.log('Error fetching lessons:', error);
    //   }
    // });
  } else {
    console.error('No course ID found in route');
  }
  if (idParam) {
      // this.courseId = +idParam;

      // ✅ Get content count by course ID
      this.courseService.getContentCountByCourseId(this.courseId).subscribe({
        next: (res) => {
          
          this.countContent = res.content_count;
        },
        error: (err) => {
          console.error('Error fetching content count:', err);
          this.countContent = 0;
        }
      });
    }
    if (idParam) {
      this.courseService.getLessonCountByCourseId(this.courseId).subscribe({
        next: (res) => {
          if (res.success) {
            this.lessonCount = res.lesson_count;
          }
        },
        error: (err) => {
          console.error('Failed to fetch lesson count', err);
          this.lessonCount = 0;
        }
      });
    }
    if (idParam) {
      this.courseService.getCommentCountByCourseId(this.courseId).subscribe({
        next: (res) => {
          if (res.success) {
            this.commentCount = res.comment_count;
          }
        },
        error: (err) => {
          console.error('Failed to fetch comment count', err);
          this.commentCount = 0;
        }
      });
    }
  this.isLogined = this.courseService.isAuthenticated();
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
// loadContent(): void {
//   this.isLoading = true;

//   this.courseService.getContents(this.courseId).subscribe({
//     next: (res) => {
//       this.contents = res.contents; // already an array
//       this.isLoading = false;
//       // console.log('Contents loaded:', this.contents);
//     },
//     error: (error) => {
//       this.errorMessage = error?.error?.message || 'Failed to load content';
//       console.error('Content loading error:', error);
//       this.isLoading = false;
//     }
//   });
  
// }


loadContents(): void {
  this.isLoading = true;

  this.courseService.getContents(this.courseId).subscribe({
    next: (res) => {
      console.log('content:', res);

      // ✅ Keep raw contents array
      this.contents = res.contents;

      // ✅ Group by lesson
      const grouped: { [lessonId: number]: any } = {};
      res.contents.forEach((item: any) => {
        const lessonId = item.lesson.id;
        if (!grouped[lessonId]) {
          grouped[lessonId] = {
            lesson: item.lesson,
            contents: []
          };
        }
        grouped[lessonId].contents.push(item);
      });

      this.groupedContents = Object.values(grouped);
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to load contents', err);
      this.isLoading = false;
    }
  });
}


  loadComments(): void {
    this.isLoading = true;
    this.courseService.getCommentsByCourse(this.courseId).subscribe({
      next: res => {
        this.comments = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
setActiveSection(section: string) {
  this.activeSection = section;
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
