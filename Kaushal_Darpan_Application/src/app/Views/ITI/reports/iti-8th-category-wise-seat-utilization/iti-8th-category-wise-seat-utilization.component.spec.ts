import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti8ThCategoryWiseSeatUtilizationComponent } from './iti-8th-category-wise-seat-utilization.component';

describe('Iti8ThCategoryWiseSeatUtilization', () => {
  let component: Iti8ThCategoryWiseSeatUtilizationComponent;
  let fixture: ComponentFixture<Iti8ThCategoryWiseSeatUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti8ThCategoryWiseSeatUtilizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti8ThCategoryWiseSeatUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
