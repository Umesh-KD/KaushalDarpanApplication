import { TestBed } from '@angular/core/testing';

import { UpwardMovementService } from './upward-movement.service';

describe('UpwardMovementService', () => {
  let service: UpwardMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpwardMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
