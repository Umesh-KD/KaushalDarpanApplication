import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProvisionalCertificateComponent } from './download-provisional-certificate.component';

describe('DownloadProvisionalCertificateComponent', () => {
  let component: DownloadProvisionalCertificateComponent;
  let fixture: ComponentFixture<DownloadProvisionalCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadProvisionalCertificateComponent]
    });
    fixture = TestBed.createComponent(DownloadProvisionalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
