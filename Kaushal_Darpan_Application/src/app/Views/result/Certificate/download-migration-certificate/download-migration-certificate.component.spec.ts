import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadMigrationCertificateComponent } from './download-migration-certificate.component';

describe('DownloadMigrationCertificateComponent', () => {
  let component: DownloadMigrationCertificateComponent;
  let fixture: ComponentFixture<DownloadMigrationCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadMigrationCertificateComponent]
    });
    fixture = TestBed.createComponent(DownloadMigrationCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
