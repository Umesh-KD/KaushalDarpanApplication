import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateDocumentComponent } from './duplicate-document.component';

describe('CompanyMasterComponent', () => {
  let component:  DuplicateDocumentComponent;
  let fixture: ComponentFixture<DuplicateDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicateDocumentComponent]
    });
    fixture = TestBed.createComponent(DuplicateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
