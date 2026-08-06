import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalRDashboardComponent } from './signal-r-dashboard.component';

describe('SignalRDashboardComponent', () => {
  let component: SignalRDashboardComponent;
  let fixture: ComponentFixture<SignalRDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignalRDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalRDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
