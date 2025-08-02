import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  standalone: false,

  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  course: any[] = [];
  loading = true;
  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute,) { }
  // ngOnInit(): void {
  //   const idParam = this.route.snapshot.paramMap.get('courseId');
  //   console.log(idParam);
  //   if (idParam) {
  //     this.courseId = +idParam;

  //     // ✅ Get content count by course ID
  //     this.apiService.getContentCountByCourseId(this.courseId).subscribe({
  //       next: (res) => {
  //         console.log('count content:',res)
  //         this.countContent = res.content_count;
  //       },
  //       error: (err) => {
  //         console.error('Error fetching content count:', err);
  //         this.countContent = 0;
  //       }
  //     });
  //   }
  //   if (this.courseId) {
  //     this.apiService.getLessonCountByCourseId(this.courseId).subscribe({
  //       next: (res) => {
  //         if (res.success) {
  //           this.lessonCount = res.lesson_count;
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Failed to fetch lesson count', err);
  //         this.lessonCount = 0;
  //       }
  //     });
  //   }
  //   if (this.courseId) {
  //     this.apiService.getCommentCountByCourseId(this.courseId).subscribe({
  //       next: (res) => {
  //         if (res.success) {
  //           this.commentCount = res.comment_count;
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Failed to fetch comment count', err);
  //         this.commentCount = 0;
  //       }
  //     });
  //   }
  //   this.apiService.getCourse().subscribe((response) => {
  //     this.course = response.course; // Ensure response contains 'news' array
  //     console.log(response)
  //     this.loading = false;
  //   }, (error) => {
  //     console.error('Error fetching news:', error);
  //     this.loading = false;
  //   });
  // }
ngOnInit(): void {
    this.apiService.getCourse().subscribe({
      next: (response) => {
        const courses = response.course || [];
        this.course = courses;

        // Fetch counts for each course
        for (let item of this.course) {
          const courseId = item.id;

          // Get content count
          this.apiService.getContentCountByCourseId(courseId).subscribe({
            next: (res) => item.countContent = res.content_count || 0,
            error: () => item.countContent = 0
          });

          // Get lesson count
          this.apiService.getLessonCountByCourseId(courseId).subscribe({
            next: (res) => item.lessonCount = res.lesson_count || 0,
            error: () => item.lessonCount = 0
          });

          // Get comment count
          this.apiService.getCommentCountByCourseId(courseId).subscribe({
            next: (res) => item.commentCount = res.comment_count || 0,
            error: () => item.commentCount = 0
          });
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.loading = false;
      }
    });
  }

  onBuy(courseId: number) {
    this.apiService.isLoggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
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
    });
  }
 
}
