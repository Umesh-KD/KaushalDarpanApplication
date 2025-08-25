import { TestBed } from '@angular/core/testing';

import { DownloadCertificateService } from './download-certificate.service';

describe('MigrationCertificateService', () => {
  let service: DownloadCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
