import { TestBed } from '@angular/core/testing';

import { PaperSetterService } from './paper-setter.service';

describe('PaperSetterService', () => {
  let service: PaperSetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
