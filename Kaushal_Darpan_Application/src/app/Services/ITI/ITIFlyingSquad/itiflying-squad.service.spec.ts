import { TestBed } from '@angular/core/testing';

import { ITIFlyingSquadService } from './itiflying-squad.service';

describe('ITICenterObserverService', () => {
  let service: ITIFlyingSquadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIFlyingSquadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
