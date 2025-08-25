import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationStudentMakePaymentComponent } from './revaluation-student-make-payment.component';

describe('RevaluationStudentMakePaymentComponent', () => {
  let component: RevaluationStudentMakePaymentComponent;
  let fixture: ComponentFixture<RevaluationStudentMakePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevaluationStudentMakePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevaluationStudentMakePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
