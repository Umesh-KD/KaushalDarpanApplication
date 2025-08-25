import { TestBed } from '@angular/core/testing';
import { ItiCampusPostService } from './iticampus-post.service';


describe('ItiCampusPostService', () => {
  let service: ItiCampusPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItiCampusPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
