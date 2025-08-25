import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAvailabiltiesComponent } from './room-availabilties.component';

describe('RoomAvailabiltiesComponent', () => {
  let component: RoomAvailabiltiesComponent;
  let fixture: ComponentFixture<RoomAvailabiltiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomAvailabiltiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAvailabiltiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
