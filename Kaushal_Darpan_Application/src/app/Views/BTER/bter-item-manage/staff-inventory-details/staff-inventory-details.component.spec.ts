import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInventoryDetailsComponent } from './staff-inventory-details.component';

describe('StaffInventoryDetailsComponent', () => {
  let component: StaffInventoryDetailsComponent;
  let fixture: ComponentFixture<StaffInventoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffInventoryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
