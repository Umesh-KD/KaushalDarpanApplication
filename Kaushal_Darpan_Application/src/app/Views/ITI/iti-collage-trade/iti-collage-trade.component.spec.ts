import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICollageTradeComponent } from './iti-collage-trade.component';

describe('ITICollageTradeComponent', () => {
  let component: ITICollageTradeComponent;
  let fixture: ComponentFixture<ITICollageTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITICollageTradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITICollageTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
