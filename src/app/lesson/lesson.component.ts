import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lesson',
  standalone: false,
  
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.css'
})
export class LessonComponent {
  lessons: any[] = [];
  exercise: any[] = [];
  selectedLesson: any = null;
  hasPurchased: boolean = true;
  contents: any[] = [];
  courseId!: number;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ✅ Get courseId from route
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // convert to number
      this.loadLessons(); // load lessons by courseId
    });

    this.loadContents(); // optional global content
  }

  loadLessons(): void {
    this.apiService.getLessonsByCourse(this.courseId).subscribe({
  next: (res) => {
    console.log('Full response:', res);
    this.lessons = res.lesson || []; // adjust this key as needed
    if (this.lessons.length > 0) {
      this.selectedLesson = this.lessons[0];
      this.loadExercise();
    }
  },
  error: (err) => {
    console.error('Failed to fetch lessons', err);
  }
});

  }

  selectLesson(lesson: any): void {
    this.selectedLesson = lesson;
    
    // console.log('Selected Lesson:', this.selectedLesson);
    setTimeout(() => {
      const video = this.videoPlayer?.nativeElement;
      if (video) {
        video.pause();
        video.load();
        video.play();
      }
    });

    this.loadExercise();
  }

  loadExercise(): void {
    if (!this.selectedLesson) return;

    this.apiService.getExercise(this.selectedLesson.id).subscribe({
      next: (response) => {
        this.exercise = response.exercise;
      },
      error: (error) => {
        console.error('Failed to load exercise:', error);
        this.exercise = [];
      }
    });
  }

  loadContents(): void {
    this.apiService.getContents(this.courseId).subscribe({
      next: (response) => {
        this.contents = response.content;
      },
      error: (error) => {
        console.error('Failed to load content:', error);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
