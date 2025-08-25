import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationStudentVerifyComponent } from './revaluation-student-verify.component';

describe('RevaluationStudentVerifyComponent', () => {
  let component: RevaluationStudentVerifyComponent;
  let fixture: ComponentFixture<RevaluationStudentVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevaluationStudentVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevaluationStudentVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
