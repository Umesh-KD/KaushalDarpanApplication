import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeBudgetListComponent } from './college-budget-list.component';

describe('CollegeBudgetListComponent', () => {
  let component: CollegeBudgetListComponent;
  let fixture: ComponentFixture<CollegeBudgetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegeBudgetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeBudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
