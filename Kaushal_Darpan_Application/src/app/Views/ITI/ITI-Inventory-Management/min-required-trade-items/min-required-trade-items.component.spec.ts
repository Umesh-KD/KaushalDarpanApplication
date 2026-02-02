import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinRequiredTradeItemsComponent } from './min-required-trade-items.component';

describe('MinRequiredTradeItemsComponent', () => {
  let component: MinRequiredTradeItemsComponent;
  let fixture: ComponentFixture<MinRequiredTradeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinRequiredTradeItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinRequiredTradeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
