import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-slider',
  standalone: false,
  
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  sliders: any[] = [];

  constructor(private sliderService: ApiService) {}

  ngOnInit(): void {
    this.sliderService.getSliders().subscribe((response) => {
      this.sliders = response.sliders;
    });
  }
}
