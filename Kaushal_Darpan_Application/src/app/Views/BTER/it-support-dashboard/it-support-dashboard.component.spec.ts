import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITSupportDashboardComponent } from './it-support-dashboard.component';

describe('ITSupportDashboardComponent', () => {
  let component: ITSupportDashboardComponent;
  let fixture: ComponentFixture<ITSupportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITSupportDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITSupportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
