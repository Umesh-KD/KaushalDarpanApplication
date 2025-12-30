import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellingCandidateListReportComponent } from './counselling-candidate-list-report.component';

describe('AllotedCandidateListReportComponent', () => {
  let component: CounsellingCandidateListReportComponent;
  let fixture: ComponentFixture<CounsellingCandidateListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounsellingCandidateListReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounsellingCandidateListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
