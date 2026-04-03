import { TestBed } from '@angular/core/testing';

import { QualificationMasterService } from './qualification-master.service';

describe('QualificationMasterService', () => {
  let service: QualificationMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
