import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharEsignComponent } from './aadhar-esign.component';

describe('AadharEsignComponent', () => {
  let component: AadharEsignComponent;
  let fixture: ComponentFixture<AadharEsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AadharEsignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AadharEsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
