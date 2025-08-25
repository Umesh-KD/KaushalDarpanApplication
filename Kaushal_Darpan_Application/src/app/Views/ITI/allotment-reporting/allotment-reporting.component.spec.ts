import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentReportingComponent } from './allotment-reporting.component';

describe('AllotmentReportingComponent', () => {
  let component: AllotmentReportingComponent;
  let fixture: ComponentFixture<AllotmentReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllotmentReportingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
