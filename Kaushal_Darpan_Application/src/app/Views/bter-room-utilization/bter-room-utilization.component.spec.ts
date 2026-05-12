import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterRoomUtilizationComponent } from './bter-room-utilization.component';

describe('BterRoomUtilizationComponent', () => {
  let component: BterRoomUtilizationComponent;
  let fixture: ComponentFixture<BterRoomUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterRoomUtilizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterRoomUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
