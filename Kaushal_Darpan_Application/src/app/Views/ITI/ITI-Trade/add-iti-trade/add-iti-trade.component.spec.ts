import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiTradeComponent } from './add-iti-trade.component';

describe('AddItiTradeComponent', () => {
  let component: AddItiTradeComponent;
  let fixture: ComponentFixture<AddItiTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItiTradeComponent]
    });
    fixture = TestBed.createComponent(AddItiTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
