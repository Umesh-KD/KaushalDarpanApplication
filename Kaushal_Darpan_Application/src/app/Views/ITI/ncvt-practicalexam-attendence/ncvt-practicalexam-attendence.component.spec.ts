import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcvtPracticalexamAttendenceComponent } from './ncvt-practicalexam-attendence.component';

describe('NcvtPracticalexamAttendenceComponent', () => {
  let component: NcvtPracticalexamAttendenceComponent;
  let fixture: ComponentFixture<NcvtPracticalexamAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NcvtPracticalexamAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NcvtPracticalexamAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
