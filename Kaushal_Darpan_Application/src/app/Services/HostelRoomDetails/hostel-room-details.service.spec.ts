import { TestBed } from '@angular/core/testing';

import { HostelRoomDetailsService } from './hostel-room-details.service';

describe('HostelRoomDetailsService', () => {
  let service: HostelRoomDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostelRoomDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
