import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherHigherTechnicalEducationReportComponent } from './teacher-higher-technical-education-report.component';

describe('TeacherHigherTechnicalEducationReportComponent', () => {
  let component: TeacherHigherTechnicalEducationReportComponent;
  let fixture: ComponentFixture<TeacherHigherTechnicalEducationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherHigherTechnicalEducationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherHigherTechnicalEducationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
