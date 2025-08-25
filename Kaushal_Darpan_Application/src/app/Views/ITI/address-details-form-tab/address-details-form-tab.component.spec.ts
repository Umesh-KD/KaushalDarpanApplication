import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDetailsFormTabComponent } from './address-details-form-tab.component';

describe('AddressDetailsFormTabComponent', () => {
  let component: AddressDetailsFormTabComponent;
  let fixture: ComponentFixture<AddressDetailsFormTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressDetailsFormTabComponent]
    });
    fixture = TestBed.createComponent(AddressDetailsFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
