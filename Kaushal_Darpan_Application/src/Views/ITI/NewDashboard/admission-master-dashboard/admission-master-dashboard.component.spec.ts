import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionMasterDashboardComponent } from './admission-master-dashboard.component';

describe('AdmissionMasterDashboardComponent', () => {
  let component: AdmissionMasterDashboardComponent;
  let fixture: ComponentFixture<AdmissionMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmissionMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
