import { TestBed } from '@angular/core/testing';

import { MarksheetIssueDateService } from './marksheet-issue-date.service';

describe('MarksheetIssueDateService', () => {
  let service: MarksheetIssueDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarksheetIssueDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
