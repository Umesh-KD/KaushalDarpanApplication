import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterAttendenceRoomComponent } from './bter-attendence-room.component';

describe('BterAttendenceRoomComponent', () => {
  let component: BterAttendenceRoomComponent;
  let fixture: ComponentFixture<BterAttendenceRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterAttendenceRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterAttendenceRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
