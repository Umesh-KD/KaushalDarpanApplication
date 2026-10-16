import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauExamReportComponent } from './tableau-exam-report.component';

describe('TableauExamReportComponent', () => {
  let component: TableauExamReportComponent;
  let fixture: ComponentFixture<TableauExamReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableauExamReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauExamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
