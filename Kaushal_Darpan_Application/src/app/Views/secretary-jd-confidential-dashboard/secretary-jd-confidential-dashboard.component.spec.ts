import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryJdConfidentialDashboardComponent } from './secretary-jd-confidential-dashboard.component';

describe('SecretaryJdConfidentialDashboardComponent', () => {
  let component: SecretaryJdConfidentialDashboardComponent;
  let fixture: ComponentFixture<SecretaryJdConfidentialDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryJdConfidentialDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretaryJdConfidentialDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
