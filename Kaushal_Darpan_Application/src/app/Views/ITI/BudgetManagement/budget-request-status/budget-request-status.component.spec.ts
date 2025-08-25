import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRequestStatusComponent } from './budget-request-status.component';

describe('BudgetRequestStatusComponent', () => {
  let component: BudgetRequestStatusComponent;
  let fixture: ComponentFixture<BudgetRequestStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetRequestStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
