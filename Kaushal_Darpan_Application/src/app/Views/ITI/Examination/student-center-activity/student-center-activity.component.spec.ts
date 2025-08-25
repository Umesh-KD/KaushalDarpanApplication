import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCenterActivityComponent } from './student-center-activity.component';

describe('StudentCenterActivityComponent', () => {
  let component: StudentCenterActivityComponent;
  let fixture: ComponentFixture<StudentCenterActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentCenterActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCenterActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
