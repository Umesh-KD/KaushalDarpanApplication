import { TestBed } from '@angular/core/testing';

import { CampusPostService } from './campus-post.service';

describe('CampusPostService', () => {
  let service: CampusPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
