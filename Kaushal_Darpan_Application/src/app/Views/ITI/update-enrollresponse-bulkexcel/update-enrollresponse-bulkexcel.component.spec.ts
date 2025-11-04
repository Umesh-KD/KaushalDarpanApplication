import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEnrollResponseBulkExcelComponent } from './update-enrollresponse-bulkexcel.component';

describe('CompanyMasterComponent', () => {
  let component: UpdateEnrollResponseBulkExcelComponent;
  let fixture: ComponentFixture<UpdateEnrollResponseBulkExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEnrollResponseBulkExcelComponent]
    });
    fixture = TestBed.createComponent(UpdateEnrollResponseBulkExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
