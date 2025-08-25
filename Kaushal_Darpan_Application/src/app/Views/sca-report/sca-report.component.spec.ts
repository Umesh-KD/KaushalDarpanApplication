import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaReportComponent } from './sca-report.component';

describe('ScaReportComponent', () => {
  let component: ScaReportComponent;
  let fixture: ComponentFixture<ScaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScaReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
