import { TestBed } from '@angular/core/testing';

import { StudentdetailUpdateService } from './studentdetail-update.service';

describe('StudentdetailUpdateService', () => {
  let service: StudentdetailUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentdetailUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
