import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSideBarComponent } from './test-side-bar.component';

describe('TestSideBarComponent', () => {
  let component: TestSideBarComponent;
  let fixture: ComponentFixture<TestSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestSideBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
