import { TestBed } from '@angular/core/testing';

import { AddRoomsService } from './add-rooms.service';

describe('AddRoomsService', () => {
  let service: AddRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
