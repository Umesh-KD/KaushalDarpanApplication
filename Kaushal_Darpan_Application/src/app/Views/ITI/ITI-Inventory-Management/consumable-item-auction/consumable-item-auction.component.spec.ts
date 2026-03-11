import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableItemAuctionComponent } from './consumable-item-auction.component';

describe('ConsumableItemAuctionComponent', () => {
  let component: ConsumableItemAuctionComponent;
  let fixture: ComponentFixture<ConsumableItemAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableItemAuctionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableItemAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
