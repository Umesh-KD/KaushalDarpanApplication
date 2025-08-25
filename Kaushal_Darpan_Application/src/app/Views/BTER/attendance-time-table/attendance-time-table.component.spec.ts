import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceTimeTableComponent } from './attendance-time-table.component';

describe('AttendanceTimeTableComponent', () => {
  let component: AttendanceTimeTableComponent;
  let fixture: ComponentFixture<AttendanceTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceTimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
