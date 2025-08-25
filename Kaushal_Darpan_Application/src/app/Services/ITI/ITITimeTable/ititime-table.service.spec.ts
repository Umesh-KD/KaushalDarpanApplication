import { TestBed } from '@angular/core/testing';

import { ITITimeTableService } from './ititime-table.service';

describe('ITITimeTableService', () => {
  let service: ITITimeTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITITimeTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
