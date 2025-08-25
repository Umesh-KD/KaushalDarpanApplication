import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateLetterComponent } from './certificate-letter.component';

describe('CertificateLetterComponent', () => {
  let component: CertificateLetterComponent;
  let fixture: ComponentFixture<CertificateLetterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateLetterComponent]
    });
    fixture = TestBed.createComponent(CertificateLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
