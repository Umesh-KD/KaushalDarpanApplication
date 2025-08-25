import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDistributeComponent } from './budget-distribute.component';

describe('BudgetDistributeComponent', () => {
  let component: BudgetDistributeComponent;
  let fixture: ComponentFixture<BudgetDistributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetDistributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetDistributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
