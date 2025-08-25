import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointExaminerListComponent } from './appoint-examiner-list.component';

describe('AppointExaminerListComponent', () => {
  let component: AppointExaminerListComponent;
  let fixture: ComponentFixture<AppointExaminerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointExaminerListComponent]
    });
    fixture = TestBed.createComponent(AppointExaminerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
