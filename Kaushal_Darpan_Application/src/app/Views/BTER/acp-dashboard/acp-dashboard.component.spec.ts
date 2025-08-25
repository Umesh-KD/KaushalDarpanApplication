import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACPDashboardComponent } from './acp-dashboard.component';

describe('ACPDashboardComponent', () => {
  let component: ACPDashboardComponent;
  let fixture: ComponentFixture<ACPDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ACPDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ACPDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
