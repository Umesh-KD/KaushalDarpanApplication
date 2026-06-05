import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCategoryComponent } from './ordercategory.component';

describe('OrderCategoryComponent', () => {
  let component: OrderCategoryComponent;
  let fixture: ComponentFixture<OrderCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
