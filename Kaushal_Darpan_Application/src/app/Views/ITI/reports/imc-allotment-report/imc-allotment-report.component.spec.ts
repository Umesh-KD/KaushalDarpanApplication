import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IMCAllotmentReportComponent } from './imc-allotment-report.component';

describe('IMCAllotmentReportComponent', () => {
  let component: IMCAllotmentReportComponent;
  let fixture: ComponentFixture<IMCAllotmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IMCAllotmentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IMCAllotmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
