import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetUCHeadComponent } from './budget-uc-head.component';

describe('BudgetUCHeadComponent', () => {
  let component: BudgetUCHeadComponent;
  let fixture: ComponentFixture<BudgetUCHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetUCHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetUCHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
