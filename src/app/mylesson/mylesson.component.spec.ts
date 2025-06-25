import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MylessonComponent } from './mylesson.component';

describe('MylessonComponent', () => {
  let component: MylessonComponent;
  let fixture: ComponentFixture<MylessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MylessonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MylessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
