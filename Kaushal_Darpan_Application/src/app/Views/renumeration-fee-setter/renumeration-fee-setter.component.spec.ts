import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenumerationFeeSetterComponent } from './renumeration-fee-setter.component';

describe('RenumerationFeeSetterComponent', () => {
  let component: RenumerationFeeSetterComponent;
  let fixture: ComponentFixture<RenumerationFeeSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenumerationFeeSetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenumerationFeeSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
