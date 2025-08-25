import { TestBed } from '@angular/core/testing';

import { RoomsMasterService } from './rooms-master.service';

describe('RoomsMasterService', () => {
  let service: RoomsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
