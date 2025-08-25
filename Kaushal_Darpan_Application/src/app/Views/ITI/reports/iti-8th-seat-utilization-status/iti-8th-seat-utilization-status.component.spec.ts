import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti8ThSeatUtilizationStatusComponent } from './iti-8th-seat-utilization-status.component';

describe('Iti8ThSeatUtilizationStatus', () => {
  let component: Iti8ThSeatUtilizationStatusComponent;
  let fixture: ComponentFixture<Iti8ThSeatUtilizationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti8ThSeatUtilizationStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti8ThSeatUtilizationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
