import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAndCircularComponent } from './OrderAndCircular.component';

describe('OrderAndCircularComponent', () => {
  let component: OrderAndCircularComponent;
  let fixture: ComponentFixture<OrderAndCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAndCircularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAndCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
