import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerDispatchRevalVerifyComponent } from './examiner-dispatch-reval-verify.component';

describe('ExaminerDispatchRevalVerifyComponent', () => {
  let component: ExaminerDispatchRevalVerifyComponent;
  let fixture: ComponentFixture<ExaminerDispatchRevalVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerDispatchRevalVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerDispatchRevalVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
