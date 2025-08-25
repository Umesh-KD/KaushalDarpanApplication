import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BterEmStaffRequestRelievingJoiningReportComponent } from './BterEmStaffRequestRelievingJoiningReport-list.component';



describe('BterEmStaffRequestRelievingJoiningReport', () => {
  let component: BterEmStaffRequestRelievingJoiningReportComponent;
  let fixture: ComponentFixture<BterEmStaffRequestRelievingJoiningReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterEmStaffRequestRelievingJoiningReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterEmStaffRequestRelievingJoiningReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
