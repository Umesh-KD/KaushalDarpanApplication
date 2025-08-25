import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsFormTabComponent } from './document-details-form-tab.component';

describe('DocumentDetailsFormTabComponent', () => {
  let component: DocumentDetailsFormTabComponent;
  let fixture: ComponentFixture<DocumentDetailsFormTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentDetailsFormTabComponent]
    });
    fixture = TestBed.createComponent(DocumentDetailsFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
