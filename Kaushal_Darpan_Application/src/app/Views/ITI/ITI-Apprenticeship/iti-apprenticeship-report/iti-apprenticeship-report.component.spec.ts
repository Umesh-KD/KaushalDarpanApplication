import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIApprenticeshipReportComponent } from './iti-apprenticeship-report.component';

describe('ITIApprenticeshipReportComponent', () => {
  let component: ITIApprenticeshipReportComponent;
  let fixture: ComponentFixture<ITIApprenticeshipReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIApprenticeshipReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIApprenticeshipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
