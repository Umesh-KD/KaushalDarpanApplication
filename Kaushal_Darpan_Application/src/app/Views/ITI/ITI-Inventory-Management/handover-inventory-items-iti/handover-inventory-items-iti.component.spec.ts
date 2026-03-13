import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverInventoryItemsITIComponent } from './handover-inventory-items-iti.component';

describe('HandoverInventoryItemsITIComponent', () => {
  let component: HandoverInventoryItemsITIComponent;
  let fixture: ComponentFixture<HandoverInventoryItemsITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandoverInventoryItemsITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandoverInventoryItemsITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
