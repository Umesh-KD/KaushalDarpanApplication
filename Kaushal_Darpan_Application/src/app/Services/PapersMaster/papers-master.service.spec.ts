import { TestBed } from '@angular/core/testing';

import { PapersMasterService } from './papers-master.service';

describe('PapersMasterService', () => {
  let service: PapersMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PapersMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
