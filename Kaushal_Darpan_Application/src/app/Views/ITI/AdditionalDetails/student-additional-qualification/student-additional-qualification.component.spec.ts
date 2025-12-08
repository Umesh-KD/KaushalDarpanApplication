import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAdditionalQualificationComponent } from './student-additional-qualification.component';

describe('CompanyMasterComponent', () => {
  let component: StudentAdditionalQualificationComponent;
  let fixture: ComponentFixture<StudentAdditionalQualificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAdditionalQualificationComponent]
    });
    fixture = TestBed.createComponent(StudentAdditionalQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
