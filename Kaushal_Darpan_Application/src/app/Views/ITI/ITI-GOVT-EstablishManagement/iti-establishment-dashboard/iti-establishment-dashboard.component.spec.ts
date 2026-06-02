import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIEstablishmentDashboardComponent } from './iti-establishment-dashboard.component';

describe('ITIEstablishmentDashboardComponent', () => {
  let component: ITIEstablishmentDashboardComponent;
  let fixture: ComponentFixture<ITIEstablishmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIEstablishmentDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIEstablishmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
