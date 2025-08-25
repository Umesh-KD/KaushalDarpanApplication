import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExaminationITIComponent } from './student-examination-iti.component';

describe('StudentExaminationITIComponent', () => {
  let component: StudentExaminationITIComponent;
  let fixture: ComponentFixture<StudentExaminationITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentExaminationITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExaminationITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
