import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvigilatorAppointmentComponent } from './invigilator-appointment.component';

describe('InvigilatorAppointmentComponent', () => {
  let component: InvigilatorAppointmentComponent;
  let fixture: ComponentFixture<InvigilatorAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvigilatorAppointmentComponent]
    });
    fixture = TestBed.createComponent(InvigilatorAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
