import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetReportComponent } from './budget-report.component';

describe('BudgetDistributeComponent', () => {
  let component: BudgetReportComponent;
  let fixture: ComponentFixture<BudgetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
