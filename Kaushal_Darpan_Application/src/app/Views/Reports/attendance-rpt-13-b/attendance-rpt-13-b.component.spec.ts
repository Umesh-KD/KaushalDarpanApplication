import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRpt13BComponent } from './attendance-rpt-13-b.component';

describe('AttendanceRpt13BComponent', () => {
  let component: AttendanceRpt13BComponent;
  let fixture: ComponentFixture<AttendanceRpt13BComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceRpt13BComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceRpt13BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
