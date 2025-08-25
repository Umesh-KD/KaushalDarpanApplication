import { TestBed } from '@angular/core/testing';

import { MarksheetDownloadService } from './marksheet-download.service';

describe('MarksheetDownloadService', () => {
  let service: MarksheetDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarksheetDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
