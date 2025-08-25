import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiDocumentScrutinyComponent } from './iti-document-scrutiny.component';

describe('ItiDocumentScrutinyComponent', () => {
  let component: ItiDocumentScrutinyComponent;
  let fixture: ComponentFixture<ItiDocumentScrutinyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiDocumentScrutinyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiDocumentScrutinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
