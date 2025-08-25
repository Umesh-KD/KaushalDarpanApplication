import { TestBed } from '@angular/core/testing';
import { ITIDispatchService } from './ITIDispatch.service';

describe('IssuedItemsService', () => {
  let service: ITIDispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ITIDispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
