import { TestBed } from '@angular/core/testing';

import { ItiTradeService } from './iti-trade.service';

describe('ItiTradeService', () => {
  let service: ItiTradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiTradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
