import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationRosterComponent } from './reservation-roster.component';

describe('ReservationRosterComponent', () => {
  let component: ReservationRosterComponent;
  let fixture: ComponentFixture<ReservationRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationRosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
