import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-news',
  standalone: false,
  
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  news: any[] = [];

  constructor(private newsService: ApiService) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe((response) => {
      this.news = response.news; // Ensure response contains 'news' array
    }, (error) => {
      console.error('Error fetching news:', error);
    });
  }
}
