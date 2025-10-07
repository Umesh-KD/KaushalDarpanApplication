import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellingImportCandidateListComponent } from './counselling-import-candidate-list.component';

describe('CompanyMasterComponent', () => {
  let component: CounsellingImportCandidateListComponent;
  let fixture: ComponentFixture<CounsellingImportCandidateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellingImportCandidateListComponent]
    });
    fixture = TestBed.createComponent(CounsellingImportCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
