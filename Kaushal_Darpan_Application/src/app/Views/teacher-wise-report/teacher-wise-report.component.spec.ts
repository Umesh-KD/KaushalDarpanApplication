import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherWiseReportComponent } from './teacher-wise-report.component';

describe('TeacherWiseReportComponent', () => {
  let component: TeacherWiseReportComponent;
  let fixture: ComponentFixture<TeacherWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherWiseReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
