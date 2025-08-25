import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamShiftMasterComponent } from './exam-shift-master.component';

describe('ExamShiftMasterComponent', () => {
  let component: ExamShiftMasterComponent;
  let fixture: ComponentFixture<ExamShiftMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamShiftMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamShiftMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
