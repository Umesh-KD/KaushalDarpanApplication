import { TestBed } from '@angular/core/testing';

import { ITIGenerateDownloadRollNoListService } from './itigenerate-download-roll-no-list.service';

describe('ITIGenerateDownloadRollNoListService', () => {
  let service: ITIGenerateDownloadRollNoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIGenerateDownloadRollNoListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
