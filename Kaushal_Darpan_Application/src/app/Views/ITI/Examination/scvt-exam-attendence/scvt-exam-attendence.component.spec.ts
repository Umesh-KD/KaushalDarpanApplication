import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScvtExamAttendenceComponent } from './scvt-exam-attendence.component';

describe('ScvtExamAttendenceComponent', () => {
  let component: ScvtExamAttendenceComponent;
  let fixture: ComponentFixture<ScvtExamAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScvtExamAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScvtExamAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
