import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolatedItiTradeComponent } from './consolated-iti-trade.component';

describe('ConsolatedItiTradeComponent', () => {
  let component: ConsolatedItiTradeComponent;
  let fixture: ComponentFixture<ConsolatedItiTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolatedItiTradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolatedItiTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
