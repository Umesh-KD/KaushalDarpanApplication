import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRoomDashboardComponent } from './guestroom-dashboard.component';

describe('GuestRoomDashboardComponent', () => {
  let component: GuestRoomDashboardComponent;
  let fixture: ComponentFixture<GuestRoomDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestRoomDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestRoomDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
