import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcvtAdmissionStudentListComponent } from './ncvt-admission-student-list.component';

describe('NcvtAdmissionStudentListComponent', () => {
  let component: NcvtAdmissionStudentListComponent;
  let fixture: ComponentFixture<NcvtAdmissionStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NcvtAdmissionStudentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NcvtAdmissionStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
