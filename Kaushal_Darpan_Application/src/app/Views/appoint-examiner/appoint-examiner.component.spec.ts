import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointExaminerComponent } from './appoint-examiner.component';

describe('AppointExaminerComponent', () => {
  let component: AppointExaminerComponent;
  let fixture: ComponentFixture<AppointExaminerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointExaminerComponent]
    });
    fixture = TestBed.createComponent(AppointExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
