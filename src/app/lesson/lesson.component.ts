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

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  courseId!: number;
  lessonId!: number;
  lessons: any[] = [];
  groupedContents: any[] = []; // [{ lesson_title: string, lectures: [] }]
  selectedContent: any = null;
  activeSectionIndex: number | null = null;
  exercises: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('courseId');
    // const idLesson = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = +idParam;
      this.lessonId = +idParam;
      this.loadContents();
      this.loadExercise()
    } else {
      console.error('No course ID found in route');
    }
  }
  // loadContents(): void {
  //   this.isLoading = true;
  //   this.apiService.getContents(this.courseId).subscribe({
  //     next: (res) => {
  //       console.log('API response:', res);

  //       if (res.success && res.contents && res.contents.length > 0) {
  //         // Group contents by lesson
  //         const grouped = res.contents.reduce((acc: any, content: any) => {
  //           const lessonId = content.lesson?.id;
  //           if (!lessonId) return acc;

  //           let group = acc.find((g: any) => g.id === lessonId);
  //           if (!group) {
  //             group = {
  //               id: lessonId,
  //               title: content.lesson?.title || 'មេរៀនគ្មានចំណងជើង',
  //               contents: []
  //             };
  //             acc.push(group);
  //           }
  //           group.contents.push(content);
  //           return acc;
  //         }, []);

  //         this.lessons = grouped;
  //         this.groupByLesson();

  //         const firstGroup = this.groupedContents[0];
  //         if (firstGroup && firstGroup.lectures.length > 0) {
  //           this.selectContent(firstGroup.lectures[0]);
  //           this.activeSectionIndex = 0;
  //         }
  //       } else {
  //         this.errorMessage = 'មិនមានមេរៀន';
  //       }
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Could not load content.';
  //       console.error(err);
  //       this.isLoading = false;
  //     }
  //   });
  // }
// Call this manually when needed
  

loadContents(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.apiService.getContents(this.courseId).subscribe({
    next: (res) => {
      if (res.success && Array.isArray(res.contents) && res.contents.length > 0) {
        const grouped = res.contents.reduce((acc: any[], content: any) => {
          const lessonId = content.lesson?.id;
          if (!lessonId) return acc;

          let group = acc.find(g => g.id === lessonId);
          if (!group) {
            group = {
              id: lessonId,
              title: content.lesson?.title || 'មេរៀនគ្មានចំណងជើង',
              contents: []
            };
            acc.push(group);
          }
          group.contents.push(content);
          return acc;
        }, []);

        this.lessons = grouped;
        this.groupByLesson();

        // Wait for view to update before selecting first content
        setTimeout(() => {
          const firstGroup = this.groupedContents[0];
          if (firstGroup && firstGroup.lectures.length > 0) {
            this.selectContent(firstGroup.lectures[0]);
            this.activeSectionIndex = 0;
          }
        }, 0);

      } else {
        this.errorMessage = 'មិនមានមេរៀន';
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = 'Could not load content.';
      console.error(err);
      this.isLoading = false;
    }
  });
}

loadExercise(): void {
    if (this.courseId) {
      this.apiService.getExercise(this.courseId).subscribe({
        next: (res) => {
           this.exercises = res.exercises;
          console.log('Exercise',res)
        },
        error: (err) => {
          console.error('Failed to load exercises', err);
        }
      });
    }
  }
  groupByLesson(): void {
    this.groupedContents = this.lessons.map(lesson => ({
      lesson_title: lesson.title || 'មេរៀនគ្មានចំណងជើង',
      lectures: lesson.contents || []
    }));
  }
  toggleSection(index: number) {
    if (this.activeSectionIndex === index) {
      this.activeSectionIndex = null; // close if same clicked again
    } else {
      this.activeSectionIndex = index; // open clicked section
    }
  }
  selectContent(content: any): void {
    this.selectedContent = content;
    setTimeout(() => {
      const video = this.videoPlayer?.nativeElement;
      if (video && content.video_url) {
        video.src = `http://localhost:8000/storage/${content.video_url}`;
        video.load();
        video.play();
      }
    }, 0);
  }

  goBack(): void {
    window.history.back();
  }
}
