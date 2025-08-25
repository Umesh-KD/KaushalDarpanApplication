import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeBudgetRequestComponent } from './college-budget-request.component';

describe('CollegeBudgetRequestComponent', () => {
  let component: CollegeBudgetRequestComponent;
  let fixture: ComponentFixture<CollegeBudgetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegeBudgetRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeBudgetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
