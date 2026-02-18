import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPlanningDashboardComponent } from './ITI-Planning-Dashboard.component';

describe('ITIPlanningDashboardComponent', () => {
  let component: ITIPlanningDashboardComponent;
  let fixture: ComponentFixture<ITIPlanningDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIPlanningDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPlanningDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
