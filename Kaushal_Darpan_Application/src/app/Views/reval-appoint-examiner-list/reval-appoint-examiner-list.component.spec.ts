import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevalAppointExaminerListComponent } from './reval-appoint-examiner-list.component';

describe('RevalAppointExaminerListComponent', () => {
  let component: RevalAppointExaminerListComponent;
  let fixture: ComponentFixture<RevalAppointExaminerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevalAppointExaminerListComponent]
    });
    fixture = TestBed.createComponent(RevalAppointExaminerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
