import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellingAllotmentListComponent } from './counselling-allotment-list.component';

describe('CompanyMasterComponent', () => {
  let component: CounsellingAllotmentListComponent;
  let fixture: ComponentFixture<CounsellingAllotmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellingAllotmentListComponent]
    });
    fixture = TestBed.createComponent(CounsellingAllotmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
