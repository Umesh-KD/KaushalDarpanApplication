import { TestBed } from '@angular/core/testing';

import { CenterExamCoordinatorService } from './center-exam-coordinator.service';

describe('CenterExamCoordinatorService', () => {
  let service: CenterExamCoordinatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterExamCoordinatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
