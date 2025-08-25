import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCollegeReportComponent } from './iti-college-report.component';

describe('ItiCollegeReportComponent', () => {
  let component: ItiCollegeReportComponent;
  let fixture: ComponentFixture<ItiCollegeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCollegeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCollegeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
