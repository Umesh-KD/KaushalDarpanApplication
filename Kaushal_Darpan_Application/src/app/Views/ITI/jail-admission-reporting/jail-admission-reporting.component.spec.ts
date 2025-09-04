import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JailAdmissionReportingComponent } from './jail-admission-reporting.component';

describe('JailAdmissionReportingComponent', () => {
  let component: JailAdmissionReportingComponent;
  let fixture: ComponentFixture<JailAdmissionReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JailAdmissionReportingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JailAdmissionReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
