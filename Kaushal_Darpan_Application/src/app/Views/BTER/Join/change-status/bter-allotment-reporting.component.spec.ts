import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterAllotmentReportingComponent } from './bter-allotment-reporting.component';

describe('BterAllotmentReportingComponent', () => {
  let component: BterAllotmentReportingComponent;
  let fixture: ComponentFixture<BterAllotmentReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterAllotmentReportingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterAllotmentReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
