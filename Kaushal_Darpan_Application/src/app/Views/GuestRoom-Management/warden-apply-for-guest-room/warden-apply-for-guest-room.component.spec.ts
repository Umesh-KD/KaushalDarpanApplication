import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardenApplyForGuestRoomComponent } from './warden-apply-for-guest-room.component';

describe('WardenApplyForGuestRoomComponent', () => {
  let component: WardenApplyForGuestRoomComponent;
  let fixture: ComponentFixture<WardenApplyForGuestRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardenApplyForGuestRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardenApplyForGuestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
