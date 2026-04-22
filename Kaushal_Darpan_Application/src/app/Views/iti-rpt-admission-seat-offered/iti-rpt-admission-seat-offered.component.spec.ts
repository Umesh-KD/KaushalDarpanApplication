import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIRPTAdmissionSeatOfferedComponent } from './iti-rpt-admission-seat-offered.component';

describe('ITIRPTAdmissionSeatOfferedComponent', () => {
  let component: ITIRPTAdmissionSeatOfferedComponent;
  let fixture: ComponentFixture<ITIRPTAdmissionSeatOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIRPTAdmissionSeatOfferedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIRPTAdmissionSeatOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
