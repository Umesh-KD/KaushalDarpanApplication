import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItiTradeComponent } from './list-iti-trade.component';

describe('ListItiTradeComponent', () => {
  let component: ListItiTradeComponent;
  let fixture: ComponentFixture<ListItiTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListItiTradeComponent]
    });
    fixture = TestBed.createComponent(ListItiTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
