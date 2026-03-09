import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMBudgetHeadMasterComponent } from './em-budget-head-master.component';

describe('EMBudgetHeadMasterComponent', () => {
  let component: EMBudgetHeadMasterComponent;
  let fixture: ComponentFixture<EMBudgetHeadMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EMBudgetHeadMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMBudgetHeadMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
