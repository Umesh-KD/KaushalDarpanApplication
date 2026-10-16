import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeInchargeDashboardComponent } from './committee-incharge-dashboard.component';

describe('CommitteeInchargeDashboardComponent', () => {
  let component: CommitteeInchargeDashboardComponent;
  let fixture: ComponentFixture<CommitteeInchargeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommitteeInchargeDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitteeInchargeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
