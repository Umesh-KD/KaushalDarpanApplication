import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaidByChallanComponent } from './fee-paid-by-challan.component';

describe('FeePaidByChallanComponent', () => {
  let component: FeePaidByChallanComponent;
  let fixture: ComponentFixture<FeePaidByChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeePaidByChallanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePaidByChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
