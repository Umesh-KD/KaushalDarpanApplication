import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostwiseOfficeVacancyReportComponent } from './postwise-office-vacancy-report.component';

describe('PostwiseOfficeVacancyReportComponent', () => {
  let component: PostwiseOfficeVacancyReportComponent;
  let fixture: ComponentFixture<PostwiseOfficeVacancyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostwiseOfficeVacancyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostwiseOfficeVacancyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
