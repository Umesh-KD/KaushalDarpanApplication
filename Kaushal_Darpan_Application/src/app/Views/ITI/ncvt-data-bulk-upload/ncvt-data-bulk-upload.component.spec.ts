import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcvtDataBulkUploadComponent } from './ncvt-data-bulk-upload.component';

describe('NcvtDataBulkUploadComponent', () => {
  let component: NcvtDataBulkUploadComponent;
  let fixture: ComponentFixture<NcvtDataBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NcvtDataBulkUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NcvtDataBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
