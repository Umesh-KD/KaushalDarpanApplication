import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentReportITIComponent } from './establishment-report-iti.component';

describe('EstablishmentReportITIComponent', () => {
  let component: EstablishmentReportITIComponent;
  let fixture: ComponentFixture<EstablishmentReportITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablishmentReportITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablishmentReportITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
