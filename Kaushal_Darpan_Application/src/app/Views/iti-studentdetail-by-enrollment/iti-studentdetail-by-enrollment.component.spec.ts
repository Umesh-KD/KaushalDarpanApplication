import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiStudentdetailByEnrollmentComponent } from './iti-studentdetail-by-enrollment.component';

describe('ItiStudentdetailByEnrollmentComponent', () => {
  let component: ItiStudentdetailByEnrollmentComponent;
  let fixture: ComponentFixture<ItiStudentdetailByEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiStudentdetailByEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiStudentdetailByEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
