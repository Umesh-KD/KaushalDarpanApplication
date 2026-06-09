import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentDashboardBTERComponent } from './establishment-dashboard-bter.component';

describe('EstablishmentDashboardBTERComponent', () => {
  let component: EstablishmentDashboardBTERComponent;
  let fixture: ComponentFixture<EstablishmentDashboardBTERComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablishmentDashboardBTERComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablishmentDashboardBTERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
