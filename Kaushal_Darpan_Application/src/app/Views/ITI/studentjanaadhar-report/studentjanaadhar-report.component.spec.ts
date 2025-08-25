import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentjanaadharReportComponent } from './studentjanaadhar-report.component';

describe('StudentjanaadharReportComponent', () => {
  let component: StudentjanaadharReportComponent;
  let fixture: ComponentFixture<StudentjanaadharReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentjanaadharReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentjanaadharReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
