import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCategoryWiseSeatUtilizationComponent } from './iti-category-wise-seat-utilization.component';

describe('ItiCategoryWiseSeatUtilization', () => {
  let component: ItiCategoryWiseSeatUtilizationComponent;
  let fixture: ComponentFixture<ItiCategoryWiseSeatUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCategoryWiseSeatUtilizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCategoryWiseSeatUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
