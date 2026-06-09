import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentReportBTERComponent } from './establishment-report-bter.component';

describe('EstablishmentReportBTERComponent', () => {
  let component: EstablishmentReportBTERComponent;
  let fixture: ComponentFixture<EstablishmentReportBTERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablishmentReportBTERComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablishmentReportBTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
