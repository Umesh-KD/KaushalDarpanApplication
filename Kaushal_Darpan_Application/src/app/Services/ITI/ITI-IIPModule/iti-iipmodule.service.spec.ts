import { TestBed } from '@angular/core/testing';

import { ITIIIPManageService } from './iti-iipmodule.service';

describe('ITIInspectionService', () => {
  let service: ITIIIPManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIIIPManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
