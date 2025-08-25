import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiStudentEnrollmentComponent } from './iti-student-enrollment.component';

describe('ItiStudentEnrollmentComponent', () => {
  let component: ItiStudentEnrollmentComponent;
  let fixture: ComponentFixture<ItiStudentEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiStudentEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiStudentEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
