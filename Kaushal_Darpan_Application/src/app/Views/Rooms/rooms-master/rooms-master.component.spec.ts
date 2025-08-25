import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsMasterComponent } from './rooms-master.component';

describe('RoomsMasterComponent', () => {
  let component: RoomsMasterComponent;
  let fixture: ComponentFixture<RoomsMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomsMasterComponent]
    });
    fixture = TestBed.createComponent(RoomsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
