import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterSuperitendentExamReportComponent } from './center-superitendent-exam-report.component';

describe('CenterSuperitendentExamReportComponent', () => {
  let component: CenterSuperitendentExamReportComponent;
  let fixture: ComponentFixture<CenterSuperitendentExamReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterSuperitendentExamReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterSuperitendentExamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
