import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImportedCandidateListComponent } from './edit-imported-candidate-list.component';

describe('AddCompanyMasterComponent', () => {
  let component: EditImportedCandidateListComponent;
  let fixture: ComponentFixture<EditImportedCandidateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditImportedCandidateListComponent]
    });
    fixture = TestBed.createComponent(EditImportedCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
