import { TestBed } from '@angular/core/testing';

import { StudentCenteredActivitesService } from './student-centered-activites.service';

describe('StudentCenteredActivitesService', () => {
  let service: StudentCenteredActivitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentCenteredActivitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
