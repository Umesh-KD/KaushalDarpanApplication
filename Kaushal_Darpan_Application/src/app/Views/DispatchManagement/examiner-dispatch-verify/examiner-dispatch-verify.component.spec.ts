import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerDispatchVerifyComponent } from './examiner-dispatch-verify.component';

describe('ExaminerDispatchVerifyComponent', () => {
  let component: ExaminerDispatchVerifyComponent;
  let fixture: ComponentFixture<ExaminerDispatchVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerDispatchVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerDispatchVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
