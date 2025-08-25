import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationScrutinyComponent } from './documentation-scrutiny.component';

describe('DocumentationScrutinyComponent', () => {
  let component: DocumentationScrutinyComponent;
  let fixture: ComponentFixture<DocumentationScrutinyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentationScrutinyComponent]
    });
    fixture = TestBed.createComponent(DocumentationScrutinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
