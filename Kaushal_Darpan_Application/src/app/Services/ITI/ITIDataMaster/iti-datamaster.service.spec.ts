import { TestBed } from '@angular/core/testing';

import { ItiDataMasterService } from './iti-datamaster.service';

describe('ItiSeatIntakeService', () => {
  let service: ItiDataMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiDataMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
