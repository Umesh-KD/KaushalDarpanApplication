import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSeatMasterComponent } from './room-seat-master.component';

describe('RoomSeatMasterComponent', () => {
  let component: RoomSeatMasterComponent;
  let fixture: ComponentFixture<RoomSeatMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSeatMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSeatMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

