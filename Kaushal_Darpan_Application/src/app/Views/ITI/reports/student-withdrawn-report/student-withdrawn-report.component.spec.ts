import { ComponentFixture, TestBed } from '@angular/core/testing';
import { studentwithdrawnreportComponent } from './student-withdrawn-report.component';

describe('AllotmentReportCollegeComponent', () => {
  let component: studentwithdrawnreportComponent;
  let fixture: ComponentFixture<studentwithdrawnreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [studentwithdrawnreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(studentwithdrawnreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
