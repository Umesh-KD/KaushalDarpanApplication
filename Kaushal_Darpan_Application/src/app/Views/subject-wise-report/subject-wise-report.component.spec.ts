import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWiseReportComponent } from './subject-wise-report.component';

describe('SubjectWiseReportComponent', () => {
  let component: SubjectWiseReportComponent;
  let fixture: ComponentFixture<SubjectWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubjectWiseReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
