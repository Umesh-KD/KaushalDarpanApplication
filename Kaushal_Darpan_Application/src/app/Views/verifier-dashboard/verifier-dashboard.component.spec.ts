import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifierDashboardComponent } from './verifier-dashboard.component';

describe('VerifierDashboardComponent', () => {
  let component: VerifierDashboardComponent;
  let fixture: ComponentFixture<VerifierDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifierDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
