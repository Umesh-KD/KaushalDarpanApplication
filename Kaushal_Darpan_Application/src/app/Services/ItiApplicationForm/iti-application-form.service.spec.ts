import { TestBed } from '@angular/core/testing';

import { ItiApplicationFormService } from './iti-application-form.service';

describe('ItiApplicationFormService', () => {
  let service: ItiApplicationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiApplicationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
