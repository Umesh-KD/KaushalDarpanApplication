import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPManageAdminReportComponent } from './iip-manage-admin-report.component';

describe('IIPManageAdminReportComponent', () => {
  let component: IIPManageAdminReportComponent;
  let fixture: ComponentFixture<IIPManageAdminReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IIPManageAdminReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPManageAdminReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
