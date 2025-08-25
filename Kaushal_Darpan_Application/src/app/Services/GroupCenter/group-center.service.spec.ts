import { TestBed } from '@angular/core/testing';

import { GroupCenterService } from './group-center.service';

describe('GroupCenterService', () => {
  let service: GroupCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
