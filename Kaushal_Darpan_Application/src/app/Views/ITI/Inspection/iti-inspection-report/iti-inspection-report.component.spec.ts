import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIInspectionReportComponent } from './iti-inspection-report.component';

describe('ITIInspectionReportComponent', () => {
  let component: ITIInspectionReportComponent;
  let fixture: ComponentFixture<ITIInspectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIInspectionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIInspectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
