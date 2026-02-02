import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMinRequiredTradeItemsComponent } from './add-min-required-trade-items.component';

describe('AddMinRequiredTradeItemsComponent', () => {
  let component: AddMinRequiredTradeItemsComponent;
  let fixture: ComponentFixture<AddMinRequiredTradeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMinRequiredTradeItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMinRequiredTradeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
