import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationCertificateDownloadComponent } from './MigrationCertificateDownload.component';

describe('MigrationCertificateDownloadComponent', () => {
  let component: MigrationCertificateDownloadComponent;
  let fixture: ComponentFixture<MigrationCertificateDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MigrationCertificateDownloadComponent]
    });
    fixture = TestBed.createComponent(MigrationCertificateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
