import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectAdmissionReportComponent } from './direct-admission-report.component';

describe('DirectAdmissionReportComponent', () => {
  let component: DirectAdmissionReportComponent;
  let fixture: ComponentFixture<DirectAdmissionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectAdmissionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectAdmissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
