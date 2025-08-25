import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelRoomDetailsComponent } from './hostel-room-details.component';

describe('HostelRoomDetailsComponent', () => {
  let component: HostelRoomDetailsComponent;
  let fixture: ComponentFixture<HostelRoomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostelRoomDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
