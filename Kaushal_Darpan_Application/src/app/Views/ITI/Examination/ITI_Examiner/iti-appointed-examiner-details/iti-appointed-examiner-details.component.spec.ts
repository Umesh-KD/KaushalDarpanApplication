import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiAppointedExaminerDetailsComponent } from './iti-appointed-examiner-details.component';

describe('ItiAppointedExaminerDetailsComponent', () => {
  let component: ItiAppointedExaminerDetailsComponent;
  let fixture: ComponentFixture<ItiAppointedExaminerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiAppointedExaminerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiAppointedExaminerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
