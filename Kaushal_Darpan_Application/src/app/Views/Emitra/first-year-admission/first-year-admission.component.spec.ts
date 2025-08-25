import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstYearAdmissionComponent } from './first-year-admission.component';

describe('FirstYearAdmissionComponent', () => {
  let component: FirstYearAdmissionComponent;
  let fixture: ComponentFixture<FirstYearAdmissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstYearAdmissionComponent]
    });
    fixture = TestBed.createComponent(FirstYearAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
