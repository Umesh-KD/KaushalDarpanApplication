import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryJDDashboardComponent } from './secretary-jd-dashboard.component';

describe('SecretaryJDDashboardComponent', () => {
  let component: SecretaryJDDashboardComponent;
  let fixture: ComponentFixture<SecretaryJDDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryJDDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretaryJDDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
