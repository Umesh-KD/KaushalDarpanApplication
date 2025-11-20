import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotedCandidateListReportComponent } from './alloted-candidate-list-report.component';

describe('AllotedCandidateListReportComponent', () => {
  let component: AllotedCandidateListReportComponent;
  let fixture: ComponentFixture<AllotedCandidateListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotedCandidateListReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotedCandidateListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
