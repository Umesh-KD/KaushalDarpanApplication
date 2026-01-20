import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointexaminerreportComponent } from './iti-appoint-examiner-report.component';

describe('AppointexaminerreportComponent', () => {
  let component: AppointexaminerreportComponent;
  let fixture: ComponentFixture<AppointexaminerreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointexaminerreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointexaminerreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
