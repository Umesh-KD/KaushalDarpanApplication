import { TestBed } from '@angular/core/testing';

import { CreateTpoService } from './create-tpo.service';

describe('CreateTpoService', () => {
  let service: CreateTpoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateTpoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
