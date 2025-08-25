import { TestBed } from '@angular/core/testing';
import { ItiCenterService } from './BoardUniversityMaster.service';

describe('ItiCenterService', () => {
  let service: ItiCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
