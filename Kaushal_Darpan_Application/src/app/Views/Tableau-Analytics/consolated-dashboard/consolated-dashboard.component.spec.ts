import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolatedDashboardComponent } from './consolated-dashboard.component';

describe('ConsolatedDashboardComponent', () => {
  let component: ConsolatedDashboardComponent;
  let fixture: ComponentFixture<ConsolatedDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolatedDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolatedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
